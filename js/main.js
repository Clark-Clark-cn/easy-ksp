// 主菜单处理函数
function handleMenuClick(menuType) {
    console.log(`点击了 ${menuType} 菜单`);
    
    const clickedButton = event.target.closest('.menu-item');
    if (clickedButton) {
        clickedButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clickedButton.style.transform = '';
        }, 150);
    }
    
    switch(menuType) {
        case 'rocket-builder':
            showNotification('main.rocketBuilder.title', 'rocketBuilder.notifications.launched', 'rocket');
            setTimeout(() => {
                window.location.href = 'rocket-build.html';
            }, 1000);
            break;
            
        case 'tracking-station':
            showNotification('main.trackingStation.title', 'main.comingSoon', 'tracking');
            // TODO: 跳转到追踪站页面
            setTimeout(() => {
                const message = window.i18n ? window.i18n.t('main.comingSoon') : '即将推出！';
                alert(message);
            }, 1000);
            break;
            
        default:
            console.log('未知菜单类型:', menuType);
    }
}

// 显示通知函数
function showNotification(titleKey, messageKey, type) {
    const title = window.i18n ? window.i18n.t(titleKey) : titleKey;
    const message = window.i18n ? window.i18n.t(messageKey) : messageKey;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(79, 195, 247, 0.9)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        minWidth: '300px',
        maxWidth: '400px'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('KSP Web 游戏已加载');
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            const speed = (index % 3 + 1) * 0.01;
            const x = (mouseX * speed);
            const y = (mouseY * speed);
            star.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    setTimeout(() => {
        showNotification('notifications.welcome.title', 'notifications.welcome.message', 'welcome');
    }, 500);
});