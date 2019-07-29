# Layer Chat Migration

[Layer's API is shutting down](https://getstream.io/blog/layer-shutting-down-all-chat-operations/) October 30th leaving many customers in a difficult position. This guide shows you how to export your data from Layer and safely migrate to Stream.

This is a work in progress. The automatic import functionality on Stream's side is tested by many customers.
We are still working to make it easier to export data from Layer. Following the steps in this repo will be easier in a few days.

## TODO

-   More docs on how to setup serverless
-   Webhook signature validation
-   Test coverage on conversion logic...
-   Easy setup of React demo app for browsing your data...
-   Go based generic endpoint run by Stream so you don't need your own webhook

## Step 1 - Layer Chat Data Export, Creating an Export

Install the layer-migrate tool

```bash
$ yarn global add layer-migrate
```

A. You need to generate a key to sign your layer export with:

```bash
$ mkdir keys
$ openssl genrsa -out keys/layer-export.pem 2048 && openssl rsa -in keys/layer-export.pem -pubout -out keys/layer-export.pub
```

B. As a second step you'll want to lookup your application ID and the Server API token from your Layer Dashboard.

```bash
$ export LAYER_APP_ID=YOUR_APP_ID_HERE (looks like 1dab157e-4d19-11e6-bb33-493b0000asdfasba)
$ export LAYER_TOKEN=YOUR_TOKEN_HERE (2vsm4yLCG24Y44IfSK6w8nBIxAgrVcU20zuPJ3fO8eXXv5Ub)
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

```bash
$ layer-migrate export
```

## Step 2 - Downloading a Layer Chat Export

A. Wait for the export to complete

```bash
$ layer-migrate status
```

Note that Layer will also send you an email when the download completes

B. Download the export

Once the export is completed the JSON will include a download_url. Go ahead and download it.

```bash
$ wget -O download.tar.gz.enc download_url
```

C. Decrypt the export

https://docs.layer.com/reference/server_api/data.out#decrypting-export-archives

```bash
# path to the file you just downloaded
$ export ENCRYPTED_TARBALL=download.tar.gz.enc
# path for the unencrypted tar
$ export OUTPUT_TAR=export.tar.gz
# path to the private key
$ export PRIVATE_KEY_PATH=keys/layer-export-key.pem
# the encrypted_aes_key from the export json
$ export ENCRYPTED_AES_KEY=V5sWiwjTVEur3/YfHvAsqj2tIBAcw5Q0pVnwQT1A03SwrD5PpQKZv9IlN1wFncVmuk+UWM2ZEJXbDUJRrHZktFvG9TTDL4M39HoFDqQNUD2g6Sof6JMmTAmoohHrVBiKDMxHXftuN+K/xnk0XR6xytPGd44R9NLuOVnOSgYldqQzCGHXIutUSfrbji+SWL3bPOJ72PMWolxoB8kVnFzwaiKn8spMzetw5yOsilwcijQy8PqUsDMz6ExKYvTB7N1tKmUccfSQoLG4jRqTlrgVGWpwp/a/kRDN5gsbGasZqi3zRP0tzcSOpAPH2mjfAc6gbrCLkaWPdtzVw3LWDo6HOQ==
# the aes_iv key from the export json
$ export AES_IV=dcmxMx47CNS6R5d8VcMISA==

$ openssl enc -in $ENCRYPTED_TARBALL -out $OUTPUT_TAR -d -aes-256-cbc -K `echo $ENCRYPTED_AES_KEY | base64 --decode | openssl rsautl -decrypt -inkey $PRIVATE_KEY_PATH | hexdump -ve '1/1 "%.2x"'` -iv `echo $AES_IV | base64 --decode | hexdump -ve '1/1 "%.2x"'`
```

## Step 3 - Create your Stream account

Head over to https://getstream.io/chat and click on the "Sign Up" button.

![](https://i.imgur.com/bDgLKED.png)

Next, go to https://getstream.io/dashboard and click on the created application (or create a new application should you need to). Then, click on the "Chat" button at the top of the dashboard.

![](https://i.imgur.com/POKREev.png)

Under the application, you can find your Stream App Key as well as your Stream App Secret. Both are needed in order to start the live migration from Layer to Stream Chat.

![](https://i.imgur.com/Br30g5H.png)

## Step 3 - Import to Stream

Simply email support@getstream.io with your data export. It typically takes 1 business day to import the data; however, smaller data exports will take less time.

> Note: Depending on your security preferences you can either send us the decrypted file, or the encrypted version with the key to decode it.

## Step 4 - Webhooks (optional)

You can start syncing writes from Stream to Layer via webhooks. This is especially useful if you have mobile clients where it takes a while to update.

### Option A - Stream Webhook

We are currently working on a generic Stream webhook that you can use to sync layer to Stream. This is still a work in progress.

### Option B - Serverless webhook

Have a look at the serverless folder. It includes a functional example webhook of how you can sync layer to Stream.

### Testing your webhook

You can set the webhook using this command:

```bash
$ layer-migrate webhook --url yourwebhookurl
```

And test it like this:

```bash
$ layer-migrate test-webhook
```

## Step 5 - React/ iOS/ React Native

The stream support team will send you a fully functional react example for testing your imported data. You'll want to review these 4 tutorials to learn more about how Stream works:

-   [React Chat Tutorial](https://getstream.io/chat/react-chat/tutorial/)
-   [React Native Chat Tutorial](https://getstream.io/chat/react-native-chat/tutorial/)
-   [iOS/Swift Chat Tutorial](https://getstream.io/tutorials/ios-chat/)
-   [Chat API Tour](https://getstream.io/chat/get_started/)

## Step 6 - Migrate the UI

Implement the UI that you want for your chat, and flip the switch. Customizing Stream's libraries is typically easier than starting from scratch.
