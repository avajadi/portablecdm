import colors from "./colors";


/* Lowest supported build nummer */
const hasWithdraw = {
    pcb: 505,
}

export const hasEventsLegacy = [
    'qa.segot',
    'qa.portcdm.eu',
    'seume.portcdm',
    'qa.nosvg',
    'dev.portcdm.eu',
    'segot.portcdm.eu',
    'qa.esvlc.portcdm.eu',
    '192.168.56.101',
    'qa.sebro.portcdm.eu',
    'esbcn.portcdm.eu',
]

const hasEvents = {
    pcb: 454,
}

export const isStaging = [
    'dev.portcdm.eu',
]

const hasComment = {
    pcb: 486,
}

export default createInstanceInfo = (instanceInfo, host) => {
    
    let pcbBuild = parseInt(instanceInfo.pcb.buildNumber);
    if (!pcbBuild) {
        pcbBuild = 493;
    }

    let withdraw = parseInt(pcbBuild) >= hasWithdraw.pcb;
    let portCallEndPoint = pcbBuild >= hasEvents.pcb ? '/events' : '/operations';
    let contentType = pcbBuild >= hasEvents.pcb ? 'application/json' : 'application/xml';
    let staging = isStaging.some(x => host.includes(x));
    let comment = pcbBuild >= hasComment.pcb;

    console.log('Has stag   ? ' + staging);

    return {
        hasWithdraw: withdraw,
        portCallEndPoint,
        contentType,
        hasComment: comment,
        isStaging: staging,
    };
}