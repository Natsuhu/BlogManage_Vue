const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  avatar: state => state.settings.avatar,
  menuOpeneds: state => state.settings.menuOpeneds
}
export default getters
