import numpy as np
import tensorflow as tf
from flask import Flask, request

from UGATIT import UGATIT
from main import parse_args
from utils import load_test_data, save_images, show_all_variables


with tf.Session(config=tf.ConfigProto(allow_soft_placement=True)) as sess:
    def anime2selfie(self, file_input):
        tf.global_variables_initializer().run(session=self.sess)
        self.saver = tf.train.Saver()
        could_load, checkpoint_counter = self.load(self.checkpoint_dir)
        if could_load :
            print(" [*] Load SUCCESS")
        else :
            print(" [!] Load failed...")
            return None

        sample_image = np.asarray(load_test_data(file_input, size=self.img_size))
        fake_img = self.sess.run(self.test_fake_A, feed_dict = {self.test_domain_B : sample_image})

        save_images(fake_img, [1, 1], '/tmp/a.jpg')
        return 

    def selfie2anime(self, file):
        pass

    args = parse_args()
    gan = UGATIT(sess, args)
    gan.build_model()
    show_all_variables()
    app = Flask(__name__)
    
    @app.route('/anime2selfie', methods=['POST'])
    def anime2selfie():
        file = request.files['file']

        output = anime2selfie(gan, file)

        return {}

    if __name__ == "__main__":
        app.run(debug=False, port=3010, host='0.0.0.0')
