<template>
    <div class="content">
        <div class="control-panel">
            <input class="input" type="file" @change="handleFileChange" accept="image/*">
            <div class="selected-images-list">
                <div 
                class="selected-images-list__image-name"
                v-for="image in selectedImages"
                :key="image.id" 
                @click="toggleActiveImage(image)"
                :class="{'active-slide' : image.isActive}"
                >
                    {{ image.id }}
                    {{ image.name }}
                </div>
            </div>
            <div class="broadcast-types">
                <p class="broadcast-types__title">Выберите</p>
                <div
                    class="broadcast-types__display-name"
                    v-for="display of displayTypes"
                    :key="display.id"
                    @click="toggleActiveDisplay(display)"
                    :class="{'active-display' : display.isActive}"
                >
                {{ display.name }}
                </div>
            </div>
            <button class="start"
            @click="this.isViewingMode = !this.isViewingMode;"
            >
                <p v-if="!isViewingMode">Начать просмотр</p>
                <p v-if="isViewingMode">Окончить просмотр</p>
            </button>
        </div>
        <div v-if="!isViewingMode" class="image-box">
            <div class="selected-img"
                v-for="image in selectedImages"
                :key="image.id"
            >
                <img 
                    :class="{'selected-img__active-image' : image.isActive}" 
                    class="selected-img__image" :src="image.url" alt=""
                >
            </div>
        </div>
    </div>
    <div v-if="isViewingMode" class="viewing-screen">
        <div
            class="viewing-screen__img"
            v-for="image in selectedImages"
            :key="image.id"
            >
            <div v-if="image.isActive">
                <img
                    :src="image.url"
                    v-for="display of displayTypes"
                    :key="display.name"
                    :class="getDisplayClass(image)"
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            isMobile: false,
            currentImage: 0,
            activeBroadcastType: 0,
            isViewingMode: false,
            selectedImages: [],
            displayTypes: [
                {
                    name: 'полноэкранный режим',
                    isActive: true,
                },
                {
                    name: 'растянуть по вертикали',
                    isActive: false,
                },
                {
                    name: 'растянуть по горизонтали',
                    isActive: false,
                },
                {
                    name: 'режим 1 к 1',
                    isActive: false,
                },
            ],
        }
    },
    methods: {
        handleFileChange(event) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                const image = {
                    name: selectedFile.name,
                    url: URL.createObjectURL(selectedFile),
                    isActive: false,
                    id: this.selectedImages.length + 1
                };
                this.selectedImages.push(image);
            }
        },
        toggleActiveImage(selectedImage) {
            for (let i = 0; i < this.selectedImages.length; i++) {
                this.selectedImages[i].isActive = false;
            }
            
            selectedImage.isActive = !selectedImage.isActive;
        },
        toggleActiveDisplay(selectedDisplay) {
            for (let i = 0; i < this.displayTypes.length; i++) {
                this.displayTypes[i].isActive = false;
            }
            
            selectedDisplay.isActive = !selectedDisplay.isActive;
            localStorage.setItem('displayTypes', JSON.stringify(this.displayTypes));
        },
        getDisplayClass(image) {
            const activeDisplay = this.displayTypes.find(display => display.isActive);
            if (activeDisplay) {
                if (activeDisplay.name === 'полноэкранный режим') {
                    return 'full-screen';
                } else if (activeDisplay.name === 'растянуть по горизонтали') {
                    return 'horizontal-stretch-screen';
                } else if (activeDisplay.name === 'растянуть по вертикали') {
                    return 'vertical-stretch-screen';
                } else if (activeDisplay.name === 'режим 1 к 1' && !this.isMobile) {
                    return 'square-stretch-screen-desktop';
                } else if (activeDisplay.name === 'режим 1 к 1' && this.isMobile) {
                    return 'square-stretch-screen-mobile';
                } else {
                    return '';
                }
            }
        },
        checkIfMobile() {
            this.isMobile = window.innerWidth <= 900;
        },
    },
    created() {
        const savedDisplayTypes = localStorage.getItem('displayTypes');
        if (savedDisplayTypes) {
            this.displayTypes = JSON.parse(savedDisplayTypes);
        }

        this.checkIfMobile();
    }
}
</script>

<style lang="scss" scoped>
    .content {
        height: 100%;
        width: 100%;
        margin: auto;
        display: flex;
        justify-content: space-between;
        @media screen and (max-width: 1100px) {
            width: 100%;
            margin-top: 10px;
        }
    }
    .control-panel {
        position: fixed;
        width: 30%;
        margin: 10px;
        padding: 20px;
        border-radius: 5px;
        background: white;
        @media screen and (max-width: 1100px) {
            width: 40%;
            padding: 0;
            margin: 0;
        }
    }
    .input {
        width: 95%;
        margin: 5vh 0 20px 5%;
        border: black 1px solid;
        border-radius: 5px;
    }
    .selected-images-list  {
        width: 95%;
        margin-left: 5%;
        min-height: 50px;
        border: 1px black solid;
        border-radius: 5px;

        &__image-name {
            padding: 10px;
            cursor: pointer;
        }
    }
    .active-slide {
        background: rgb(96, 96, 96);
        color: white;
    }
    .broadcast-types {
        width: 95%;
        margin: 30px 0 0 5%;
        border: 1px black solid;
        border-radius: 5px;
        &__title {
            padding: 10px;
            font-size: 24px;
        }
        &__display-name {
            padding: 10px;
            cursor: pointer;
        }
        
    }
    .active-display {
        background: rgb(96, 96, 96);
        color: white;
    }
    .start {
        margin: 30px 0 0 5%;
        padding: 10px;
        border: 1px solid rgb(96, 96, 96);
        border-radius: 5px;
    }
    .start:hover {
        background: rgb(96, 96, 96);
        color: white;
        transition: .3s;
    }
    .image-box {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .selected-img {
        display: flex;
        justify-content: center;
        margin: auto;
        padding-top: 30px;
        &__image {
            display: none;
        }
        &__active-image {
            margin: auto;
            width: 20%;
            display: inline;
            @media screen and (max-width: 1100px) {
                width: 60%;
            }
        }
    }
    .full-screen {
        display: block;
        position: absolute;
        right: 0;
        z-index: -1;
        height: 100vh;
        width: 100vw;
        top: 0;
        background-repeat: no-repeat;
    }
    .horizontal-stretch-screen {
        display: block;
        position: absolute;
        right: 0;
        z-index: -1;
        width: 100vw;
        height: auto;
        top: 0;
        background-repeat: no-repeat;
    }
    .vertical-stretch-screen {
        display: block;
        position: absolute;
        right: 0;
        z-index: -1;
        height: 100vh;
        width: auto;
        top: 0;
        background-repeat: no-repeat;
    }
    .square-stretch-screen-desktop {
        display: block;
        width: 100vh;
        height: 100vh;
        position: absolute;
        right: 0;
        z-index: -1;
        top: 0;
        background-repeat: no-repeat;
    }
    .square-stretch-screen-mobile {
        display: block;
        width: 100vw;
        height: 100vw;
        position: absolute;
        right: 0;
        z-index: -1;
        top: 0;
        background-repeat: no-repeat;
    }
</style>