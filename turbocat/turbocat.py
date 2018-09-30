from flask import Flask
app = Flask(__name__)

@app.route('/')
def turbocat():
    return 'Hello, World!'

# TODO: routes for setting desired ratio (POST)
# TODO: routes for getting experimental, predicted ratios (GET)
