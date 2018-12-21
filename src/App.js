import React, { Component } from 'react';
import './App.scss';
import VideoUpload from './VideoUpload';
import $ from 'jquery';
import FileUploader from './FileUploader';
import Button from '@material-ui/core/Button';
import ModalRoot from './ModalRoot';
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import { showModal, hideModal } from './actions/modal'
const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
  showModal: (modalProps, modalType) => {
    dispatch(showModal({ modalProps, modalType }))
  }
})
const MESSAGE = "A redux modal component.";
class App extends Component {
  constructor(props) {
    super(props)
    this.openAlertModal = this.openAlertModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

  }

  componentDidMount(){
  }
  openAlertModal(event) {
    this.props.showModal({
      open: true,
      title: 'Alert Modal',
      message: MESSAGE,
      closeModal: this.closeModal
    }, 'alert')
  }
  closeModal(event) {
    this.props.hideModal();
  }
  render() {
    return (
      
      <div className="App">
        <VideoUpload></VideoUpload>
      </div>
       
    );
  }
  
}



export default connect(null, mapDispatchToProps)(App);
