const Notification = ({ message, typeOfNotification }) =>{
    if (message === null) {
        return null
      }
    
      return (
        <div className={typeOfNotification}>
          {message}
        </div>
      )
}

export default Notification