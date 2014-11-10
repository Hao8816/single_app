var sha1 = require('js-sha1');
var crypto = require('crypto');
var fs = require("fs");
var global_settings = require('../settings');
var rsa_public_key=global_settings.rsa_public_key;
var rsa_private_key=global_settings.rsa_private_key;

// Create SHA1 for string
String.prototype.SHA1=function(){
    return sha1(this);
};



var plaintext = "test";
/*-----------------------------------------------------------*
 * ENCRYPT: RSA 1024 bit                                     *
 *-----------------------------------------------------------*/

var cipertext = _encrypt(plaintext,rsa_private_key);

// verification
var result = _verify(plaintext, cipertext,rsa_public_key);
if (result == false) {
    console.log("encryption failed!!!");
}

function _encrypt(plaintext, privateKey)
{
    var signer = crypto.createSign("RSA-SHA256");
    signer.update(plaintext);
    var sign = signer.sign(privateKey, "hex");

    return (sign);
}

function _verify(plaintext, cipertext, publicKey)
{
    var verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(plaintext);
    var result = verifier.verify(publicKey, cipertext, "hex");

    return (result);
}
