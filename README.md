# PicPi

Clone
```bash
$ git clone https://github.com/LinnierGames/PicPi-RaspberryPi
```

### Installation (on raspberry pi)

Install nodejs and npm
```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
$ nvm install 14.15.3
```

Node should be v14.15.3 and npm should be 6.14.9

Install tooling
```bash
$ sudo apt install python-smbus
$ sudo apt-get install i2c-tools
```

Check for i2cdetect
```bash
$ sudo nano /etc/modules
```
```bash
$ sudo i2cdetect -y 1
```

Install mqtt
```bash
$ sudo apt-get install -y mosquitto mosquitto-clients
$ sudo pip3 install paho-mqtt
```

Install GUI stuff
```bash
$ sudo apt-get install python3-tk
$ sudo apt-get install python3-pil.imagetk
```

Install npm modules
```bash
$ cd nodejs-server
$ npm install
```

### Installation (on mac os)

Install nodejs and npm
Visit https://nodejs.org/en/download/ and download the installer v14.15.3

Node should be v14.15.3 and npm should be 6.14.9

Install mqtt
```bash
$ brew install mosquitto
```

Use `/usr/local/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf` to start the broker

Install GUI stuff
```bash
$ curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
$ python3 get-pip.py
$ # Add pip to $PATH
$ PATH=~/Library/Python/3.8/bin:"$PATH"
$ pip3 install paho-mqtt
$ pip3 install Pillow
```

### Runing the app

First, start the server to receive new images:
```bash
$ cd nodejs-server/
$ npm start
> pi-pic@1.0.0 start /user/directory/here/PicPi/Raspberry Pi/PicPi/nodejs-server
> node ./bin/www

Connect to this server by sending requests to: http://local.ip.address.here:3000
```

In a new cli window, or tab, run the following to start the picture frame app:
```bash
$ cd picture-frame/
$ python app.py
```

### Sending new pictures to the slideshow

Make an HTTP POST request using multi-part form data
```
// Request
POST http://${pi-ip-address}/photos/upload
name "photos"
filename "${name-of-file-plus-file-extension}"

// Response
status code: 201
body {
  message: "Success!"
}

// Response - error
status code: 400
body {
  message: "format is incorrect"
}
```
This POST endpoint does support sending multiple files in one request. To do so, send each photo with different file names but use the same `photos` form name

Here are some exmamples on sending multi-part form data in iOS:
- URLSession: https://stackoverflow.com/a/59875552/1967709
- [Moya](https://github.com/Moya/Moya): https://stackoverflow.com/a/50089462/1967709

Once the POST request finishes storing the images to disk, the server will post a MQTT event from which the picture-frame python app is listening to:
```
topic: "file-system/photos/did-update"
message: "OK"
```