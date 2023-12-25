export const LoadingReducer = (prevState = {
  isLoading: false
}, action) => {
  let newState = {...prevState}
  switch (action.type) {
    case 'change_loading':
      newState.isLoading = action.payload
      return newState
    default:
      return prevState
  }
}