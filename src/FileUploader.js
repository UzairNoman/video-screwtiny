import React from "react";
import Dropzone from 'react-dropzone';
export default class FileUploader extends React.Component {
    constructor() {
        super()
        this.state = {
            accepted: [],
            rejected: []
        }

        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload() {
        var   results    = [];
        var   CHUNK_SIZE = 5 * 1024 * 1024;
        const f          = this.state.accepted[0];
        console.log(f.name)
        function addResult(name, result) {
            const x2js = new window.X2JS();
            const resultObj = x2js.xml_str2json(result);
            resultObj.date = Date.now();
            resultObj.fileName = name;
            results.unshift(resultObj);
            console.log(results);
        }
        const g = new window.MediaInfo();
        const miLib = window.MediaInfo(function () {
            const mi         = new miLib.MediaInfo();
            const fileName   = f.name;
            let   processing = false;

            console.debug('MediaInfo ready - Parsing file', fileName);

            if (processing) {
                return;
            }

            processing = true;

            var fileSize = f.size,
                offset   = 0,
                state    = 0,
                seekTo   = -1,
                seek     = null;

            mi.open_buffer_init(fileSize, offset);

            var processChunk = function (e) {
                var l;
                if (e.target.error === null) {
                    var chunk = new Uint8Array(e.target.result);
                    l = chunk.length;
                    state = mi.open_buffer_continue(chunk, l);

                    var seekTo = -1;
                    var seekToLow = mi.open_buffer_continue_goto_get_lower();
                    var seekToHigh = mi.open_buffer_continue_goto_get_upper();

                    if (seekToLow === -1 && seekToHigh === -1) {
                        seekTo = -1;
                    } else if (seekToLow < 0) {
                        seekTo = seekToLow + 4294967296 + (seekToHigh * 4294967296);
                    } else {
                        seekTo = seekToLow + (seekToHigh * 4294967296);
                    }

                    if (seekTo === -1) {
                        offset += l;
                    } else {
                        offset = seekTo;
                        mi.open_buffer_init(fileSize, seekTo);
                    }
                    chunk = null;
                } else {
                    var msg = 'An error happened reading your file!';
                    console.err(msg, e.target.error);
                    processingDone();
                    alert(msg);
                    return;
                }
                // bit 4 set means finalized
                if (state & 0x08) {
                    var result = mi.inform();
                    mi.close();
                    addResult(fileName, result);
                    processingDone();
                    return;
                }
                seek(l);
            };

            function processingDone() {
                processing = false;
            }

            seek = function (length) {
                if (processing) {
                    var r = new FileReader();
                    var blob = f.slice(offset, length + offset);
                    r.onload = processChunk;
                    r.readAsArrayBuffer(blob);
                } else {
                    mi.close();
                    processingDone();
                }
            };

            // start
            seek(CHUNK_SIZE);

        });
    }

    render() {
            return ( 
            <section >
                <div className = "dropzone" >
                    <Dropzone accept = "image/jpeg, image/png, video/mp4"
                        onDrop = {
                            (accepted, rejected) => {
                                this.setState({
                                    accepted,
                                    rejected
                                }, () => this.handleUpload());
                            }
                        } >
                    <p> Try dropping some files here, or click to select files to upload. </p> 
                    <p> Only * .jpeg and * .png images will be accepted </p> 
                    </Dropzone> 
                </div> 
                <aside>
                    <h2> Accepted files </h2> 
                    <ul> 
                    {
                        this.state.accepted.map(f => <li key = { f.name } > { f.name } - { f.size } bytes </li>)
                    } 
                    </ul> 
                    <h2> Rejected files </h2> 
                    <ul> {
                        this.state.rejected.map(f => <li key = { f.name } > { f.name } - { f.size } bytes </li>) } 
                    </ul> 
                </aside> 
            </section>
        );
    }
}