import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { showModal, hideModal } from './actions/modal'
import { connect }            from 'react-redux'
import DetailModal from './DetailModal';
const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
  showModal: (modalProps, modalType) => {
    dispatch(showModal({ modalProps, modalType }))
  }
})
class VideoUpload extends Component {
  constructor(props) {
    super(props)
    this.closeModal = this.closeModal.bind(this);
    this.state = { files: [] }
  }
  onDrop(file) {
    console.log(file[0]);
    file = file[0];
    var context = this;
    var miLib = window.MediaInfo(function () {
      var CHUNK_SIZE = 5 * 1024 * 1024;
      console.log('MediaInfo ready');
      window['miLib'] = miLib;
      let mi = new miLib.MediaInfo();
      console.log(CHUNK_SIZE);
      let processing = false;
      if (processing) {
        return;
      }
      processing = true;

      var fileSize = file.size, offset = 0, state = 0, seekTo = -1, seek = null;

      mi.open_buffer_init(fileSize, offset);

      var processChunk = function (e) {
        var l;
        if (e.target.error === null) {
          var chunk = new Uint8Array(e.target.result);
          l = chunk.length;
          console.log('chunk length',l);
          state = mi.open_buffer_continue(chunk, l);

          var seekTo = -1;
          var seekToLow = mi.open_buffer_continue_goto_get_lower();
          var seekToHigh = mi.open_buffer_continue_goto_get_upper();

          if (seekToLow == -1 && seekToHigh == -1) {
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
          var result = mi.inform();
          addResult(file.name, result);
 
      };
      seek = function (length) {
        if (processing) {
          var r = new FileReader();
          var blob = file.slice(offset, length + offset);
          r.onload = processChunk;
          r.readAsArrayBuffer(blob);
        }
        else {
          mi.close();
          processingDone();
        }
      };
      seek(CHUNK_SIZE);

      function processingDone() {
        processing = false;
      }
      function addResult(name, result) {
        const x2js = new window.X2JS();
        var resultObj = x2js.xml_str2json(result);
        resultObj.fileName = name;
        console.log(resultObj);
        context.openAlertModal(resultObj);
      }
    });


  }
  openAlertModal(resultObj) {
    const modalMsg = resultObj.File.track[1];
    
    
    this.props.showModal({
      open: true,
      title: 'Media Information',
      message: modalMsg,
      closeModal: this.closeModal
    }, 'alert')
  }
  closeModal(event) {
    this.props.hideModal();
  }
  onCancel() {
    this.setState({
      files: []
    });
  }
  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone accept = "image/jpeg, image/png, video/mp4"
            onDrop={this.onDrop.bind(this)}
            onFileDialogCancel={this.onCancel.bind(this)}
          >
            <p>Drop your file</p>
          </Dropzone>
          <DetailModal/>
        </div>
      </section>
    );
  }
}

export default connect(null, mapDispatchToProps)(VideoUpload);
