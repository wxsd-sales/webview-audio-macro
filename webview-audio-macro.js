/********************************************************
 * 
 * Macro Author:      	William Mills
 *                    	Technical Solutions Specialist 
 *                    	wimills@cisco.com
 *                    	Cisco Systems
 * 
 * Version: 1-0-0
 * Released: 07/25/23
 * 
 * This example Webex Device Macro monitors for any Visible 
 * WebViews and ensures that its audio is connected to the 
 * Loudspeaker Output Group of the device.
 * 
 * Requirements:
 * 1. Audio Console must be enable.
 * 2. An Audio Output Group named 'Loudspeaker' must be 
 *    configured.
 * 
 * 
 * Full Readme, source code and license details available here:
 * https://github.com/wxsd-sales/webview-audio-macro
 * 
 ********************************************************/

import xapi from 'xapi';

async function init() {

  console.log(`WebView Audio Macro Initializing`);

  const audioConsole = await xapi.Config.Audio.Output.ConnectorSetup.get();

  if (audioConsole === 'Auto') {
    console.log(`Audio Console isn't enabled - exiting`);
    return;
  }

  //Enable WebView Audio and Subsribe to keep enabled
  xapi.Config.Audio.Input.WebView[1].Mode.set('On');
  xapi.Config.Audio.Input.WebView[1].Mode.on(value => {
    if (value === 'On') return;
    console.log('xConfiguration Audio Input WebView[1] Mode was changed to [Off] - Changing back to [On]')
    xapi.Config.Audio.Input.WebView[1].Mode.set('On');
  });

  // Subscribe to WebView changes
  xapi.Status.UserInterface.WebView.on(processWebview);

  // Initially check the WebView Audio Status and apply changes if required
  checkWebViewAudioStatus();
}

// Start Init function 5 seconds after startup
// this ensures the Audio Console macro has completed
setTimeout(init, 5000)

// Any time a WebView becomes visible, check the audio configuration
function processWebview(webview) {

  if (!webview.hasOwnProperty('Status') || webview.Status != 'Visible') return;
  console.log(`WebView Visible: Id [${webview.id}] - Type [${webview.Type}]`)
  checkWebViewAudioStatus();

}

async function checkWebViewAudioStatus() {
  console.log('Checking WebView Audio Configuration')

  const localInputs = await xapi.Status.Audio.Input.LocalInput.get();
  const localOutputs = await xapi.Status.Audio.Output.LocalOutput.get();

  // Identify any existing WebView LocalInput Group/Connector and Loudspeaker Output Group
  const webviewConnector = localInputs.find(input => input.hasOwnProperty('Connector') && input.Connector.includes('WebView.1'))
  const webviewLocalInput = localInputs.find(input => input.Name === 'Web')
  const loudspeakerOutput = localOutputs.find(input => input.Name === 'Loudspeaker')

  // If there is not Loudspeaker Output Group, make no changes
  if (!loudspeakerOutput) {
    console.log(`No Loudspeaker Output Group found - Existing`)
    return;
  }

  // Restore any missing WebView LocalInputs/Connectors or Links to Loudspeak LocalOutput Group
  if (webviewConnector) {

    console.log(`LocalInput Group with Connector [WebView.1] Found - Name [${webviewConnector.Name}] InputId [${loudspeakerOutput.id}]`);

    checkIfLinked(loudspeakerOutput, webviewConnector.id);

  } else if (webviewLocalInput) {

    console.log(`LocalInput Group with name [${webviewLocalInput.Name}] and no Connector [WebView.1] Connector found - InputId [${webviewLocalInput.id}] - Adding Connector`);

    xapi.Command.Audio.LocalInput.AddConnector({ ConnectorId: 1, ConnectorType: 'WebView', InputId: webviewLocalInput.id })
      .then(() => {

        console.log(`Connector [WebView.1] added to LocalInput [${webviewLocalInput.Name}] - Checking Link to Loudspeaker`);

        checkIfLinked(loudspeakerOutput, webviewLocalInput.id);

      })
      .catch(error => console.error(`Error adding Connector [WebView.1] to LocalInput [${webviewLocalInput.Name}] -`, JSON.stringify(error)))

  } else {

    console.log(`No WebView LocalInput Group found - Creating LocalInput with name [Web]`);

    xapi.Command.Audio.LocalInput.Add({ Mute: 'Off', Name: 'Web' , AGC: 'Off', Channels: 2})
      .then(newLocalInput => {

        console.log(`New LocalInput [Web] created with InputId [${newLocalInput.InputId}] - Adding [WebView.1] Connector`);

        xapi.Command.Audio.LocalInput.AddConnector({ ConnectorId: 1, ConnectorType: 'WebView', InputId: newLocalInput.InputId })
          .then(() => {
            console.log('[WebView.1] Connector added to LocalInput [Web] - Connecting to Loudspeaker');
            connectLoudspeaker(loudspeakerOutput.id, newLocalInput.InputId)
          })
          .catch(error => console.error('Error adding Connector [WebView.1] to LocalInput [Web] -', JSON.stringify(error)))

      })
      .catch(error => console.error('Error creating Connector [WebView.1] -', JSON.stringify(error)))
      
  }
}

// Check if Loudspeaker Output Group contains WebView Input Id
// and links them if not.
function checkIfLinked(localOutput, id) {
  if (localOutput.hasOwnProperty('Input') && localOutput.Input.some(input => input.id == id)) {
    console.log(`WebView InputId [${id}] already Linked to Loudspearker OutputId [${localOutput.id}] - No changes`);
  } else {
    linkToLoudspeaker(localOutput.id, id);
  }
}

// Links Input Id to Output Id
function connectLoudspeaker(outputId, inputId) {
  console.log(`Linking WebView InputId [${inputId}] with Loudspeaker OutputId [${outputId}]`)
  xapi.Command.Audio.LocalOutput.ConnectInput({ InputId: inputId, OutputId: outputId })
    .then(result => console.log('Linking result - Status:', result.status))
    .catch(error => console.error('Error linking InputId [${inputId}] with OutputId [${outputId}] -', JSON.stringify(error)))
}
