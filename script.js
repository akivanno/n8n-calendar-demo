const N8N_WEBHOOK_URL = 'https://lvstudio.app.n8n.cloud/webhook/receive-calendar';
const CALENDLY = "https://calendly.com/aki-vannini/30min?hide_event_type_details=1&hide_gdpr_banner=1"
if(VISIT_TYPE == undefined)
  alert("VISIT_TYPE is undefined")
const widget = `<div class="calendly-container">
        <div class="calendly-inline-widget" data-url="`+ CALENDLY +`" style="min-width:320px;height:700px;"></div>
    </div>
    <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>`

document.body.innerHTML = widget;

function isCalendlyEvent(e) {
    return e.origin === "https://calendly.com" && e.data.event && e.data.event.indexOf("calendly.") === 0;
}

window.addEventListener('message', function(e) {
    if (isCalendlyEvent(e)) {
        if (e.data.event === 'calendly.event_scheduled') {
            console.log("Booking completed! Forwarding payload to n8n...");

            fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    event_type: 'calendly.event_scheduled',
                    visit_type: VISIT_TYPE,
                    data: e.data.payload,
                    timestamp: new Date().toISOString()
                    
                })
            })
            .then(response => console.log('Successfully received by n8n!'))
            .catch(error => console.error('Error sending data to n8n:', error));
        }
    }
});
