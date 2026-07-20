from dotenv import load_dotenv
from app import create_app

load_dotenv()  # lee el archivo .env antes de crear la app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
