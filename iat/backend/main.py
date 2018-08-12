# import logging
import json

from flask import Flask, abort, jsonify, request
from flask_cors import CORS

from models import Result


app = Flask(__name__)
CORS(app)


@app.route('/add_result', methods=['POST'])
def submitted_result():
    text = request.data
    key = Result.new(text)
    return jsonify({'success': ':)'})


@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Server error'}), 500
