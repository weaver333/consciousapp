function setPackBackground(url) {
    if (url === 'none') {
        document.getElementById('body').style = '';
    } else {
        var packBackgroundUrl = url;
        document.getElementById('body').style = 'background-image:url(' + packBackgroundUrl + '); background-size: cover; background-repeat: no-repeat';
    }
}

export {
    setPackBackground
}