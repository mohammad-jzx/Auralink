import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math
from flask import Flask, Response, render_template_string


app = Flask(__name__)


# إعدادات النموذج والكشف
offset = 20
imgSize = 300
labels = ["Hello", "I love you", "No", "Okay", "Please", "Thank you", "Yes"]

detector = HandDetector(maxHands=1)
classifier = Classifier("Model/keras_model.h5", "Model/labels.txt")


def open_camera(index: int = 0):
    cap = cv2.VideoCapture(index)
    # يمكن تعديل الدقة عند الحاجة
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    return cap


cap = open_camera(0)


def generate_frames():
    global cap
    while True:
        success, img = cap.read()
        if not success or img is None:
            # محاولة إعادة فتح الكاميرا عند الفشل
            cap.release()
            cap = open_camera(0)
            continue

        imgOutput = img.copy()
        hands, img_annot = detector.findHands(img)

        if hands:
            hand = hands[0]
            x, y, w, h = hand['bbox']

            imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255

            # قص ضمن الحدود
            ih, iw = img.shape[:2]
            x1 = max(0, x - offset)
            y1 = max(0, y - offset)
            x2 = min(iw, x + w + offset)
            y2 = min(ih, y + h + offset)
            if x2 > x1 and y2 > y1:
                imgCrop = img[y1:y2, x1:x2]
                hC, wC = imgCrop.shape[:2]

                aspectRatio = hC / wC if wC != 0 else 1

                if aspectRatio > 1:
                    k = imgSize / hC
                    wCal = math.ceil(k * wC)
                    imgResize = cv2.resize(imgCrop, (wCal, imgSize))
                    wGap = math.ceil((imgSize - wCal) / 2)
                    imgWhite[:, wGap:wGap + wCal] = imgResize
                else:
                    k = imgSize / wC if wC != 0 else 1
                    hCal = math.ceil(k * hC)
                    imgResize = cv2.resize(imgCrop, (imgSize, hCal))
                    hGap = math.ceil((imgSize - hCal) / 2)
                    imgWhite[hGap:hGap + hCal, :] = imgResize

                prediction, index = classifier.getPrediction(imgWhite, draw=False)

                # رسمات مشابهة لـ test.py
                cv2.rectangle(imgOutput, (x - offset, y - offset - 70), (x - offset + 400, y - offset + 10), (0, 255, 0), cv2.FILLED)
                cv2.putText(imgOutput, labels[index], (x, y - 30), cv2.FONT_HERSHEY_COMPLEX, 2, (0, 0, 0), 2)
                cv2.rectangle(imgOutput, (x - offset, y - offset), (x + w + offset, y + h + offset), (0, 255, 0), 4)

        # ترميز الإطار إلى JPEG وبثّه
        ret, buffer = cv2.imencode('.jpg', imgOutput)
        if not ret:
            continue
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/')
def index():
    return render_template_string(
        """
        <!doctype html>
        <html lang="ar">
        <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>بث لغة الإشارة</title>
            <style>
                body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 0; padding: 24px; background: #0b0f19; color: #eef2ff; }
                .container { max-width: 1024px; margin: 0 auto; }
                h1 { font-size: 22px; margin: 0 0 16px; }
                .card { background: #101728; border: 1px solid #1f2a44; border-radius: 12px; padding: 16px; }
                img { width: 100%; height: auto; border-radius: 8px; display: block; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>بث التعرف على لغة الإشارة</h1>
                <div class="card">
                    <img src="/video_feed" alt="video stream"/>
                </div>
            </div>
        </body>
        </html>
        """
    )


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    # تشغيل الخادم
    app.run(host='127.0.0.1', port=5000, debug=False, threaded=True)


