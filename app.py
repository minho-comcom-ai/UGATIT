import io

import numpy as np
import tensorflow as tf
import cv2
from flask import Flask, request, send_file, jsonify

from UGATIT import UGATIT
from main import parse_args
from utils import inverse_transform, show_all_variables, merge


def load_test_data_from_memory(buffer, size):
    bytes_as_np_array = np.frombuffer(buffer.read(), dtype=np.uint8)
    img = cv2.imdecode(bytes_as_np_array, flags=cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    img = cv2.resize(img, dsize=(size, size))

    img = np.expand_dims(img, axis=0)
    img = img/127.5 - 1

    return img


def save_image_to_memory(image):
    image = inverse_transform(image)
    image = merge(image, (1, 1))
    image = cv2.cvtColor(image.astype('uint8'), cv2.COLOR_RGB2BGR)

    is_success, buffer = cv2.imencode(".jpg", image)
    io_buf = io.BytesIO(buffer)
    return io_buf


with tf.Session(config=tf.ConfigProto(allow_soft_placement=True)) as sess:
    def model_run(self, target_model, feed_key, file_input):
        sample_image = np.asarray(load_test_data_from_memory(file_input, size=self.img_size))
        fake_img = self.sess.run(target_model, feed_dict = {feed_key : sample_image})
        return save_image_to_memory(fake_img)

    def anime2selfie(self, file_input):
        return model_run(self, self.test_fake_A, self.test_domain_B, file_input)

    def selfie2anime(self, file_input):
        return model_run(self, self.test_fake_B, self.test_domain_A, file_input)

    args = parse_args()
    gan = UGATIT(sess, args)
    gan.build_model()
    show_all_variables()
    tf.global_variables_initializer().run(session=sess)
    gan.saver = tf.train.Saver()
    could_load, checkpoint_counter = gan.load(gan.checkpoint_dir)
    if could_load:
        print(" [*] Load SUCCESS")
    else :
        print(" [!] Load failed...")
        raise Exception()

    app = Flask(__name__)
    
    @app.route('/anime2selfie', methods=['POST'])
    def _anime2selfie():
        input_file_in_memory = request.files['file']
        if not input_file_in_memory:
            return jsonify({'message': 'nofile'}), 400
        output_file_in_memory = anime2selfie(gan, input_file_in_memory)
        return send_file(output_file_in_memory, mimetype='image/jpeg')

    @app.route('/selfie2anime', methods=['POST'])
    def _selfie2anime():
        input_file_in_memory = request.files['file']
        if not input_file_in_memory:
            return jsonify({'message': 'nofile'}), 400
        output_file_in_memory = selfie2anime(gan, input_file_in_memory)
        return send_file(output_file_in_memory, mimetype='image/jpeg')

    if __name__ == "__main__":
        app.run(debug=False, port=3010, host='0.0.0.0', threaded=False)
