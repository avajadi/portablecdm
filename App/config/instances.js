import colors from "./colors";


/* Lowest supported build nummer */
const hasWithdraw = {
    pcb: 505,
}

export const hasKeycloak = [
    'dev.portcdm.eu',
    'segot.portcdm.eu',
    'qa.portcdm.eu',
];

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
    'fivaa.portcdm.eu',
    'portcdm.cut.ac.cy',
]

export const promptOpposite = [
    'fivaa.portcdm.eu',
    'qa.fivaa.portcdm.eu',
    'qa.seume.portcdm.eu',
    'seume.portcdm.eu',
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
    
    let pcbBuild;
    if (isNaN(instanceInfo.pcb)) {
        pcbBuild = 493;
    } else {
        pcbBuild = parseInt(instanceInfo.pcb.buildNumber);
    }

    let withdraw = parseInt(pcbBuild) >= hasWithdraw.pcb;
    let portCallEndPoint = pcbBuild >= hasEvents.pcb ? '/events' : '/operations';
    let contentType = pcbBuild >= hasEvents.pcb ? 'application/xml' : 'application/xml';
    let staging = isStaging.some(x => host.includes(x));
    let comment = pcbBuild >= hasComment.pcb;

    console.log('Content type: ' + contentType);

    return {
        hasWithdraw: withdraw,
        portCallEndPoint,
        contentType,
        hasComment: comment,
        isStaging: staging,
    };
}