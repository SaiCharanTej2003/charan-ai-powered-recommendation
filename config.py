import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Configuration settings for Groq
config = {
    'GROQ_API_KEY': os.getenv('GROQ_API_KEY'),
    'MODEL_NAME': os.getenv('MODEL_NAME', 'llama3-70b-8192'),
    'MAX_TOKENS': int(os.getenv('MAX_TOKENS', 1000)),
    'TEMPERATURE': float(os.getenv('TEMPERATURE', 0.7)),
    'DATA_PATH': os.getenv('DATA_PATH', os.path.join(BASE_DIR, 'data', 'products.json'))
}
