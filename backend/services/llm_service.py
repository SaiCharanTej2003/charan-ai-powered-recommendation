from groq import Groq
from config import config
import json

class LLMService:
    """
    Service to handle interactions with the Groq LLM API
    """

    def __init__(self):
        """
        Initialize the Groq LLM service with configuration
        """
        self.client = Groq(api_key=config["GROQ_API_KEY"])
        self.model_name = config.get("MODEL_NAME", "llama3-70b-8192")  # Groq model
        self.max_tokens = config.get("MAX_TOKENS", 800)
        self.temperature = config.get("TEMPERATURE", 0.7)

    def generate_recommendations(self, user_preferences, browsing_history, all_products):
        """
        Generate personalized product recommendations based on user preferences and browsing history

        Parameters:
        - user_preferences (dict): User's stated preferences
        - browsing_history (list): List of product IDs the user has viewed
        - all_products (list): Full product catalog

        Returns:
        - dict: Recommended products with explanations
        """
        browsed_products = []
        for product_id in browsing_history:
            for product in all_products:
                if product["id"] == product_id:
                    browsed_products.append(product)
                    break

        prompt = self._create_recommendation_prompt(
            user_preferences, browsed_products, all_products
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an AI shopping assistant that recommends products based on user behavior and preferences.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )

            llm_output = response.choices[0].message.content.strip()

            recommendations = self._parse_recommendation_response(
                llm_output, all_products
            )
            return recommendations

        except Exception as e:
            error_message = str(e)
            print(f"Error during Groq LLM call: {error_message}")

            if "Invalid API key" in error_message:
                return {"error": "Authentication failed. Check your Groq API key."}
            elif "Rate limit" in error_message:
                return {"error": "Rate limit exceeded. Please try again later."}
            elif "network" in error_message.lower():
                return {"error": "Network issue while contacting Groq API."}
            else:
                return {"error": f"Unexpected error during LLM call: {error_message}"}

    def _create_recommendation_prompt(
        self, user_preferences, browsed_products, all_products
    ):
        """
        Create a prompt for the LLM to generate recommendations
        """
        prompt = (
            "You are an expert AI assistant specializing in personalized e-commerce product recommendations.\n"
            "Based on the user's preferences, browsing history, and the available catalog, recommend 5 suitable products.\n\n"
        )

        prompt += "User Preferences:\n"
        for key, value in user_preferences.items():
            prompt += f"- {key}: {value}\n"

        prompt += "\nBrowsing History:\n"
        for product in browsed_products:
            prompt += f"- {product['name']} (Category: {product['category']}, Price: ${product['price']})\n"

        prompt += (
            "\n### OUTPUT INSTRUCTIONS:\n"
            "Provide exactly 5 recommendations as a JSON array.\n"
            "Each item must have:\n"
            " - product_id: (string)\n"
            " - explanation: (string, why it fits the user)\n"
            " - score: (number 1–10, indicating confidence)\n"
            "\nReturn ONLY the JSON array without any extra text."
        )

        return prompt

    def _parse_recommendation_response(self, llm_response, all_products):
        """
        Parse the LLM response to extract product recommendations
        """
        try:
            start_idx = llm_response.find("[")
            end_idx = llm_response.rfind("]") + 1

            if start_idx == -1 or end_idx == 0:
                return {
                    "recommendations": [],
                    "error": "Could not parse recommendations from LLM response",
                }

            json_str = llm_response[start_idx:end_idx]
            rec_data = json.loads(json_str)

            recommendations = []
            for rec in rec_data:
                product_id = rec.get("product_id")
                product_details = next(
                    (p for p in all_products if p["id"] == product_id), None
                )

                if product_details:
                    recommendations.append(
                        {
                            "product": product_details,
                            "explanation": rec.get("explanation", ""),
                            "confidence_score": rec.get("score", 5),
                        }
                    )

            return {"recommendations": recommendations, "count": len(recommendations)}

        except Exception as e:
            print(f"Error parsing Groq LLM response: {str(e)}")
            return {
                "recommendations": [],
                "error": f"Failed to parse recommendations: {str(e)}",
            }
