# PicPi

### Installation (on raspberry pi)

Clone
```bash
$ git clone https://github.com/LinnierGames/PicPi-RaspberryPi
```

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

### Runing the app

```bash
$ cd PicPi-RaspberryPi/
$ python app.py
```