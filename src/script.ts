interface GameElement {
    id: string;
    element: HTMLElement;
}

interface TrashBag extends GameElement {
    isThrown: boolean 
}

interface TrashBin extends GameElement {
    isFull: boolean;
    bagCounter: number
}


function getElement <T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) throw new Error (`Element not found ${selector}`) 
    return element
}



const throwButton = createGameElement<GameElement>("throwButton", getElement<HTMLButtonElement>("#game-container > #throwButton"))

const trashBag = {
    ...createGameElement<TrashBag>("trashBag", getElement<HTMLDivElement>("#game-container > #trash-container #trashBag")),
    isThrown: false
};

const trashBin = {
    ...createGameElement<TrashBin>("trashBin", getElement<HTMLDivElement>("#game-container > #trash-container #trashBin")),
    isFull: false,
    bagCounter: 0

}

const trashContainer = document.querySelector<HTMLDivElement>("#game-container > #trash-container");
const resultCounter = document.querySelector<HTMLSpanElement>("#resultCounter")!


let isMoving = false


throwButton.element.addEventListener('click', throwEvent)
trashBin.element.addEventListener('click', clearTrash)


async function throwEvent():Promise<void> {
    
    if (isMoving || trashBag.isThrown || !resultCounter) return
      
    trashBag.isThrown = true
    trashBag.element.style.top = "-45px"
    isMoving = true

    await new Promise(resolve => setTimeout(resolve, 500 ))
        
    
    trashBin.bagCounter++;
    
    resultCounter.textContent = ` Count: ${trashBin.bagCounter}` 
    
    trashContainer?.removeChild(trashBag.element)
    resetBagPosition()
    trashContainer?.appendChild(trashBag.element)

    trashBag.isThrown = false;
    isMoving = false;

    checkForSmelling()
    
}

async function clearTrash(e: Event){
    
    if (isMoving  || trashBin.isFull) return
    
    trashBin.isFull = true;
    trashContainer?.removeChild(trashBin.element)
    const emptyBin = appendEmptyBin()

    resetTrashBinCounter()
    checkForSmelling()

    await new Promise<void>(resolve => setTimeout(resolve, 1500))

    trashContainer?.removeChild(emptyBin)
    trashContainer?.appendChild(trashBin.element)
    trashBin.isFull = false
    

}

function appendEmptyBin(): HTMLDivElement {
    const emptyBin = document.createElement('div');
    emptyBin.id = 'emptyBin'; // Set an ID for styling or future reference

    // Create the empty bin image
    const binImage = document.createElement('img');
    binImage.src = "https://cdn-icons-png.flaticon.com/512/102/102661.png";
    binImage.alt = "Empty Bin";

    // Create the empty bin message
    const message = document.createElement('p');
    message.textContent = "Trash is empty!";

    // Append image and message to the emptyBin container
    emptyBin.appendChild(binImage);
    emptyBin.appendChild(message);

    // Append the emptyBin to the trashContainer
    trashContainer?.appendChild(emptyBin);

    return emptyBin;
}


function resetTrashBinCounter():void {
    trashBin.bagCounter = 0
    resultCounter.textContent = ` Count: ${trashBin.bagCounter}` 
}

function resetBagPosition(): void {
    trashBag.element.style.top = "50%"
}

function createGameElement<T extends GameElement>(id: string, element: HTMLElement): T {
    return {id, element} as T
}

function checkForSmelling():void{
    const smellingMessageContainer = getElement<HTMLElement>("#smelling-container")

    trashBin.bagCounter >= 5 ? smellingMessageContainer.style.display = 'block' : smellingMessageContainer.style.display = 'none'
}