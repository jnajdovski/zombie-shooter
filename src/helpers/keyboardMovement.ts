/**
 * 
 * @param {KeyboardEvent} event 
 * @returns {string}
 */
export const keyDown = (event) => {
    switch (event.code) {
        case 'KeyA':
            return 'left'
        case 'KeyD':
            return 'right'
        case 'KeyW':
            return 'up'
        case 'KeyS':
            return 'down'
    }
};