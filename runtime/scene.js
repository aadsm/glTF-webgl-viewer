// Copyright (c) 2013, Fabrice Robinet
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//  * Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
//  * Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

var Montage = require("montage").Montage;
var Component3D = require("runtime/component-3d").Component3D;
var RuntimeTFLoader = require("runtime/runtime-tf-loader").RuntimeTFLoader;
var URL = require("montage/core/url");

exports.Scene = Component3D.specialize( {

    constructor: {
        value: function Scene() {
            this.super();
        }
    },

    _resourcesLoaded: { value: false, writable: true },

    resourcesDidLoad: {
        value: function() {
            if (!this._resourcesLoaded) {
                this._resourcesLoaded = true;
                this.dispatchEventNamed("resourcesDidLoad", true, false, this);
            }
        }
    },

    status: { value: 0, writable:true},

    path: {
        set: function(value) {
            //Work-around until montage implements textfield that do not send continous input..

            if (value) {
                if (value.indexOf(".json") === -1)
                    return;

                var URLObject = URL.parse(value);
                if (!URLObject.scheme) {
                    var packages = Object.keys(require.packages);
                    //HACK: for demo, packages[0] is guaranted to be the entry point
                    value = URL.resolve(packages[0], value);
                }
            }

            if (value !== this._path) {
                var readerDelegate = {};
                readerDelegate.loadCompleted = function (scene) {
                    this.totalBufferSize =  loader.totalBufferSize;
                    this.glTFElement = scene;
                    this.status = "loaded";
                    console.log("scene loaded:"+this._path);
                }.bind(this);

                if (value) {
                    var loader = Object.create(RuntimeTFLoader);
                    this.status = "loading";
                    loader.initWithPath(value);
                    loader.delegate = readerDelegate;
                    loader.load(null /* userInfo */, null /* options */);
                } else {
                    this.scene = null;
                }

                this._path = value;
            }
        },

        get: function() {
            return this._path;
        }
    },

    init: {
        value:function() {
            return this.initWithScene(this);
        }
    }

});
