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
        <button onClick={() => notifRequest()} className="btn">Enable Notification 알림 설정</button>
    </div>
}

export default IOSNotification