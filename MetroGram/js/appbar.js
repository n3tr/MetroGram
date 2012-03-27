

function saveBthBar_Clicked() {
    var item = data.items.getAt(0);
    uri = new Windows.Foundation.Uri(item.images.standard_resolution.url); // Remote image
    var reference = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(uri);

    if ((Windows.UI.ViewManagement.ApplicationView.value !== Windows.UI.ViewManagement.ApplicationViewState.snapped) ||
            Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
                var savePicker = new Windows.Storage.Pickers.FileSavePicker();
                savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
                savePicker.defaultFileExtension = ".jpg";
                savePicker.suggestedFileName = "photo";
                savePicker.fileTypeChoices.insert("JPEG", [".jpg", ".jpeg"]);
        

                savePicker.pickSaveFileAsync().then(function (file) {
                  
            
                });
            }
}

function logoutBthBar_Clicked() {
    localSettings.values['id'] = null;
    localSettings.values['username'] = null;
    localSettings.values['full_name'] = null;
    localSettings.values['access_token'] = null;
    window.close();
}



