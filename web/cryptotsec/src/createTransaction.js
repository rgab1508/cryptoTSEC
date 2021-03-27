import elliptic from 'elliptic';
import firebase from './firebase';

import SHA256 from './SHA256';

export default function createTransaction(sender_address,reciever_address,amount,privatekey) {
    var hash = SHA256(sender_address+reciever_address+amount);
    var EC = elliptic.ec;
    var ec = new EC('secp256k1');
    var key = ec.keyFromPrivate(privatekey);
    var sign = key.sign(hash,"base64").toDER("hex");
    firebase.database().ref("crypto/pool").push({
        sender_address: sender_address,
        reciever_address: reciever_address,
        amount: amount,
        signature: sign
    });
    return { sign, hash };
}