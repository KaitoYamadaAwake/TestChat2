'use strict';

const express = require( 'express' );
const http = require( 'http' );
const socketIO = require( 'socket.io' );
const app = express();
const server = http.Server( app );
const io = socketIO( server );
const PORT = process.env.PORT || 1337;
const SYSTEMNICKNAME = '**system**'
const toDoubleDigitString =
    ( num ) =>
    {
        return ( "0" + num ).slice( -2 );   
    };
const makeTimeString =　
    ( time ) =>
    {
        return toDoubleDigitString( time.getFullYear() ) + '/' + toDoubleDigitString( time.getMonth() + 1 ) + '/' + toDoubleDigitString( time.getDate() )
            + ' ' + toDoubleDigitString( time.getHours() ) + ':' + toDoubleDigitString( time.getMinutes() ) + ' ' + toDoubleDigitString( time.getSeconds() );
    }　//時刻表示用

let iCountUser = 0; // ユーザー数

io.on(
    'connection',
    ( socket ) =>
    {
        console.log( 'connection' );

        let strNickname = '';	

        // 切断時
        socket.on(
            'disconnect',
            () =>
            {
                console.log( 'disconnect' );

                if( strNickname )
                {
                    iCountUser--;

                    const strNow = makeTimeString( new Date() );

                    const objMessage = {
                        strNickname: SYSTEMNICKNAME,
                        strMessage: strNickname + "さんが退室しました。" + "現在" + iCountUser + "人接続中です。",
                        strDate: strNow
                    }

                    io.emit( 'spread message', objMessage );
                }
            } );

        // 入室時
        socket.on(
            'join',
            ( strNickname_ ) =>
            {
                console.log( 'joined :', strNickname_ );

                strNickname = strNickname_;

                iCountUser++;

                const strNow = makeTimeString( new Date() );

                const objMessage = {
                    strNickname: SYSTEMNICKNAME,
                    strMessage: strNickname + "さんが接続しました。" + "現在" + iCountUser + "人接続中です。",
                    strDate: strNow
                }

                io.emit( 'spread message', objMessage );
            } );

        socket.on(
            'new message',
            ( strMessage ) =>
            {
                console.log( 'new message', strMessage );

                const strNow = makeTimeString( new Date() );

                const objMessage = {
                    strNickname: strNickname,
                    strMessage: strMessage,
                    strDate: strNow
                }

                io.emit( 'spread message', objMessage );
            } );
    } );

app.use( express.static( __dirname + '/public' ) );

server.listen(
    PORT,
    () =>
    {
        console.log( 'Server on port %d', PORT );
    } );
