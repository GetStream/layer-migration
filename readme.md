# Layer Chat Migration

This is a work in progress. The automatic import functionality on Stream's side is done. We're working to make it easier to get your data out of Layer. Which is kinda cumbersome as the Layer API client doesn't support exports.

## Step 1 - Layer Chat Data Export

Install the layer-migrate tool

```
yarn global add layer-migrate
```

A. You need to generate a key to sign your layer export with:

```
openssl genrsa -out layer-export-key.pem 2048 && openssl rsa -in layer-export-key.pem -pubout -out layer-export-pub
```

B. As a second step you'll want to lookup your APP id and the Server API token from your Layer Dashboard.

```
export LAYER_APP_ID=layer:///apps/staging/1dab157e-4d19-11e6-bb33-493b000000b4
export LAYER_TOKEN=2vsm4yLCG24Y44IfSK6w8nBIxAgrVcU20zuPJ3fO8eXXv5Ub
```

C. Register your new key

```
layer-migrate register-key
```

D. Start an export

```
layer-migrate start-export
```

E. Wait for the export to complete

```
layer-migrate wait
```

F. Download the export

```
wget ... url from export
```

G. Decrypt the export

https://docs.layer.com/reference/server_api/data.out#decrypting-export-archives

```
# path to the file you just downloaded
export ENCRYPTED_TARBALL=downloaded.tar.gz.enc
# path for the unencrypted tar
export OUTPUT_TAR=export.tar.gz
# path to the private key
export PRIVATE_KEY_PATH=layer-export-key.pem
# the encrypted_aes_key from the export json
export ENCRYPTED_AES_KEY=gbwxlNIYLjFmOfWiprfPY+uiiSIA1q2Gpom0zK3ZPdooO4vPz1s0fic8LduiQVsP2lPgHiSCym0Fv2KYiIutgk3bRwPikF7NUcriQLzT80k0Px5iDaGMEHAboMmVL7yDMP+qDkJ5gUsTIOGKPQKML1kjcLTvHc2j15Fhd3RYAcFaJpGJ2ZJW+Q+Ik91mvxsA6jyjO+v1mIEFhWTOTlSLu3OGFCJxj9oxLo0NqLEQVTfOiqwRGsuTiEMTMtgREP70WX4ZoAO1NgEnTaT4r8A430r6JP6Wcz1u84DOgiacA502XiMwpLQDP72ufYpjByip9LtqFSZvr7DVJkVj+cfhyg==
# the aes_iv key from the export json
export AES_IV=dvZXo11ZNZcSS3qJ6Vy/cw==

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
