import React from 'react'
import { connect } from 'react-redux'
import ReactModal from 'react-modal';

const mapStateToProps = state => ({
  ...state.modal
})

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        modalIsOpen: nextProps.modalProps.open
      })
    }
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
    this.props.modalProps.closeModal();
  }

  render() {
    if (!this.props.modalType) {
      return null
    }
    const renderBody = () => {
      let modalMsg = ''
      for (let [key, value] of Object.entries(this.props.modalProps.message)) {
        console.log(key, value);
        modalMsg += '<span><b> '+ key +' </b></span> : <span> ' + value + ' </span></br>' ;
      }
      return { __html : modalMsg}    
    }
    return (
      <div>
        <ReactModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="React Modal"
          ariaHideApp={false}
          overlayClassName="modal fade show"
          bodyOpenClassName="modal-open"
          className="modal-dialog modal-dialog-centered"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
              >{this.props.modalProps.title}</h5>
              <button type="button" className="close" aria-label="Close" onClick={this.closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {typeof this.props.modalProps.message === 'string' ? (<p>{this.props.modalProps.message}</p>) : (<div dangerouslySetInnerHTML={renderBody()}/>) }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(ModalContainer)
