import ActionTypes from '../constants/ActionTypes';

export const showModal = ({ modalProps, modalType }) => {
  return{
    type: ActionTypes.SHOW_MODAL,
    modalProps,
    modalType
  };
}

export const hideModal = () => {
  
  return{
    type: ActionTypes.HIDE_MODAL
  };
}
