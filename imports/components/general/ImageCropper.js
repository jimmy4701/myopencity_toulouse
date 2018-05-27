import React, {Component} from 'react'
import { Input, Image, Button } from 'semantic-ui-react'
import Cropper from 'react-cropper'

if(Meteor.isClient){ import 'cropperjs/dist/cropper.css'; }

export default class ImageCropper extends Component {
    state = {
        cropped_image: ""
    }

    crop = () => {
        this.setState({cropped_image: this.refs.cropper.getCroppedCanvas().toDataURL() })
    }

    handleFileChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
        files = e.dataTransfer.files;
        } else if (e.target) {
        files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
        this.setState({ src: reader.result });
        };
        reader.readAsDataURL(files[0]);
    }

    b64toBlob = (b64Data, contentType, sliceSize) => {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }   

    submit = (e) => {
        e.preventDefault()
        const {cropped_image} = this.state
        var block = cropped_image.split(";");
        // Get the content type of the image
        var contentType = block[0].split(":")[1];// In this case "image/gif"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

        // Convert it to a blob to upload
        var blob = this.b64toBlob(realData, contentType);
        this.props.onCrop(blob)
        this.setState({src: "", cropped_image: null})
    }

    render(){
        const {src, cropped_image} = this.state
        return(
            <div>
                <Input type="file" onChange={this.handleFileChange} name="src"/>
                {src &&
                    <Cropper
                        ref='cropper'
                        src={src}
                        style={{height: 400, width: '100%'}}
                        aspectRatio={16 / 9}
                        guides={false}
                        crop={this.crop} 
                    />
                }
                {cropped_image &&
                    <div>
                        <Image src={cropped_image} size="medium" inline />
                        <Button onClick={this.submit}>Valider</Button>
                    </div>
                }
            </div>
        )
    }
}