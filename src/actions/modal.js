import ActionTypes from '../constants/ActionTypes';

export const showModal = ({ modalProps, modalType }) => dispatch => {
  console.log(modalProps,modalType);
  
  dispatch({
    type: ActionTypes.SHOW_MODAL,
    modalProps,
    modalType
  });
}

export const hideModal = () => dispatch => {
  console.log("AasS");
  
  dispatch({
    type: ActionTypes.HIDE_MODAL
  });
}
