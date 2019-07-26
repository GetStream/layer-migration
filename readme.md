# Layer Chat Migration

[Layer's API is shutting down](https://getstream.io/blog/layer-shutting-down-all-chat-operations/) October 30th leaving many customers in a difficult position.

This guide shows you how to export your data from Layer and safely migrate to Stream.

This is a work in progress. The automatic import functionality on Stream's side is tested by many customers.
What's not done yet is the scripts to easily export your data from Layer and the serverless endpoints to sync data via webhooks.
This repo will be much easier to use in a couple of days.

## Step 1 - Layer Chat Data Export, Creating an Export

Install the layer-migrate tool

```
yarn global add layer-migrate
```

A. You need to generate a key to sign your layer export with:

```
openssl genrsa -out layer-export.pem 2048 && openssl rsa -in layer-export-key.pem -pubout -out layer-export.pub
```

B. As a second step you'll want to lookup your application ID and the Server API token from your Layer Dashboard.

```
export LAYER_APP_ID=YOUR_APPI_DHERE (looks like 1dab157e-4d19-11e6-bb33-493b0000asdfasba)
export LAYER_TOKEN=YOUR_TOKEN_HERE (2vsm4yLCG24Y44IfSK6w8nBIxAgrVcU20zuPJ3fO8eXXv5Ub)
```

You can find your application ID under the `Keys` section of your Layer dashboard.

![Layer Key](https://i.imgur.com/5wQQvdX.png)

And you can find your Layer token under `Server API`.

![Layer Server API](https://i.imgur.com/lNPcV9T.png)

> Note: You must create the server API token. It will not be automatically generated for you.

C. Register your new key

```
layer-migrate register-key
```

D. Start an export

```
layer-migrate export
```

## Step 2 - Downloading a Layer Chat Export

A. Wait for the export to complete

```
layer-migrate status
```

F. Download the export

```
wget -O download longfilenamehere
```

```
wget ... url from export
```

G. Decrypt the export

https://docs.layer.com/reference/server_api/data.out#decrypting-export-archives

```
# path to the file you just downloaded
export ENCRYPTED_TARBALL=download
# path for the unencrypted tar
export OUTPUT_TAR=export.tar.gz
# path to the private key
export PRIVATE_KEY_PATH=keys/layer-export-key.pem
# the encrypted_aes_key from the export json
export ENCRYPTED_AES_KEY=V5sWiwjTVEur3/YfHvAsqj2tIBAcw5Q0pVnwQT1A03SwrD5PpQKZv9IlN1wFncVmuk+UWM2ZEJXbDUJRrHZktFvG9TTDL4M39HoFDqQNUD2g6Sof6JMmTAmoohHrVBiKDMxHXftuN+K/xnk0XR6xytPGd44R9NLuOVnOSgYldqQzCGHXIutUSfrbji+SWL3bPOJ72PMWolxoB8kVnFzwaiKn8spMzetw5yOsilwcijQy8PqUsDMz6ExKYvTB7N1tKmUccfSQoLG4jRqTlrgVGWpwp/a/kRDN5gsbGasZqi3zRP0tzcSOpAPH2mjfAc6gbrCLkaWPdtzVw3LWDo6HOQ==
# the aes_iv key from the export json
export AES_IV=dcmxMx47CNS6R5d8VcMISA==

openssl enc -in $ENCRYPTED_TARBALL -out $OUTPUT_TAR -d -aes-256-cbc -K `echo $ENCRYPTED_AES_KEY | base64 --decode | openssl rsautl -decrypt -inkey $PRIVATE_KEY_PATH | hexdump -ve '1/1 "%.2x"'` -iv `echo $AES_IV | base64 --decode | hexdump -ve '1/1 "%.2x"'`
```

## Step 2 - Import to Stream

Simply email support@getstream.io with your data export.
It typically takes us 1 business day to import the data.
(if it's a small import it will take less time).

Depending on your security preferences you can either send us the decrypted file, or the encrypted version with the key to decode it.

## Step 3 - Webhooks (optional)

You can start syncing writes from Stream to Layer via webhooks.
We're currently working on setting up a serverless example for this.

## Step 4 - React/ iOS/ React Native

The stream support team will send you a fully functional react example for testing your imported data.
You'll want to review these 4 tutorials to learn more about how Stream works:

[React Chat Tutorial](https://getstream.io/chat/react-chat/tutorial/)
[React Native Chat Tutorial](https://getstream.io/chat/react-native-chat/tutorial/)
[iOS/Swift Chat Tutorial](https://getstream.io/tutorials/ios-chat/)
[Chat API Tour](https://getstream.io/chat/get_started/)

## Step 5 - Migrate the UI

Implement the UI that you want for your chat, and flip the switch
Customizing Stream's libraries is typically easier than starting from scratch.
