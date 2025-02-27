function IOSNotification() {
    const notifRequest = () => {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              console.log('Notification Permission Granted.')
            } else if(permission === 'denied') {
              alert('You denied for the notification')
            }
        })
    }

    return <div>
        <button onClick={() => notifRequest()} className="btn">Home 홈페이지</button>
    </div>
}

export default IOSNotification