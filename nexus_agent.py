# Bilgisayarınızda çalışacak basit Python kodu (Nexus Agent)
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import webbrowser

app = Flask(__name__)
CORS(app) # Telefondan gelen istekleri kabul etmek için

@app.route('/ping', methods=['GET'])
def ping():
    return "Nexus Agent is Online!", 200

@app.route('/execute', methods=['POST'])
def execute():
    data = request.json
    action = data.get('action')
    payload = data.get('payload')
    
    print(f"Executing: {action} with {payload}")
    
    if action == "OPEN_URL":
        webbrowser.open(payload)
    elif action == "COMMAND":
        # Örn: steam://rungameid/730
        os.startfile(payload) if hasattr(os, 'startfile') else os.system(f"open {payload}")
        
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080) # Ağdaki her cihazdan erişim sağla