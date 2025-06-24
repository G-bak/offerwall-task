from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # CORS 허용 (JS에서 요청 허용을 위해)

@app.route('/api/greet', methods=['POST'])
def greet():
    data = request.get_json()
    name = data.get('name', '이름없음')
    return jsonify({'message': f'안녕하세요, {name}님!'})

if __name__ == '__main__':
    app.run(debug=True)
