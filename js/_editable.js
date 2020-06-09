// 3
const getEditableBox = el => {
    let siblings = []
    let sibling = el.parentNode.firstChild
    // 4
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== el) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling
    }
    const editable = siblings[1];
    // 5
    if (el.innerHTML === 'edit') {
        editable.style.display = 'flex'
        el.innerHTML = 'hide'
        el.style.width = '50px'
        el.style.right = 0
        el.style.border = 'none'
        return;
    } else if (el.innerHTML === 'hide') {
        editable.style.display = 'none'
        el.innerHTML = 'edit'
        el.style.width = '100%'
        el.style.right = 'unset'
        return;
    } else {
        return null
    }
}
// 1
document.querySelectorAll('div.label').forEach( label => {
    // 2
    label.addEventListener('click', (e) => {
        const el = e.target
        getEditableBox(el)
    })

})



