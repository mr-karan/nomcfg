let jobTemplatePromise = fetch('assets/nomad-job-template.njk')
    .then(response => response.text())
    .then(template => {
        nunjucks.configure({ autoescape: true });
        return template;
    })
    .catch(error => {
        console.error('Error loading template:', error);
        return '';
    });


function jobSpecGenerator() {
    return {
        jobSpec: {
            job: 'redis',
            namespace: 'default',
            datacenters: 'dc1',
            type: 'service',
            constraints: [],
            periodic: {
                cron: '',
                timeZone: ''
            },
            groups: [{
                collapsed: false,
                name: 'cache',
                count: 1,
                network: {
                    mode: 'host',
                    port: '6379'
                },
                services: [],
                tasks: [{
                    collapsed: false,
                    name: 'redis',
                    driver: 'docker',
                    config: {
                        image: 'redis:latest',
                        command: '',
                        args: ''
                    },
                    env: [],
                    resources: {
                        cpu: 500,
                        memory: 256
                    },
                    artifacts: [],
                    templates: [],
                    lifecycle: {
                        enabled: false,
                        hook: 'prestart',
                        sidecar: false
                    }
                }]
            }]
        },
        templateLoaded: false,
        init() {
            jobTemplatePromise.then(template => {
                this.jobTemplate = template;
                this.templateLoaded = true;
            });
        },
        addJobConstraint() {
            this.jobSpec.constraints.push({ attribute: '', operator: '=', value: '' });
        },
        removeJobConstraint(index) {
            this.jobSpec.constraints.splice(index, 1);
        },
        addGroup() {
            this.jobSpec.groups.push({
                name: 'new-group',
                collapsed: false,
                count: 1,
                network: {
                    mode: 'host',
                    port: ''
                },
                services: [],
                tasks: [{
                    name: 'new-task',
                    collapsed: false,
                    driver: 'docker',
                    config: {
                        image: '',
                        command: '',
                        args: ''
                    },
                    env: [],
                    resources: {
                        cpu: 100,
                        memory: 300
                    },
                    artifacts: [],
                    templates: [],
                    lifecycle: {
                        enabled: false,
                        hook: 'prestart',
                        sidecar: false
                    }
                }]
            });
        },
        removeGroup(index) {
            this.jobSpec.groups.splice(index, 1);
        },
        addService(groupIndex) {
            this.jobSpec.groups[groupIndex].services.push({
                name: 'web',
                port: '8000'
            });
        },
        removeService(groupIndex, serviceIndex) {
            this.jobSpec.groups[groupIndex].services.splice(serviceIndex, 1);
        },
        addTask(groupIndex) {
            this.jobSpec.groups[groupIndex].tasks.push({
                name: 'new-task',
                driver: 'docker',
                config: {
                    image: '',
                    command: '',
                    args: ''
                },
                env: [],
                resources: {
                    cpu: 100,
                    memory: 300
                },
                artifacts: [],
                templates: [],
                lifecycle: {
                    enabled: false,
                    hook: 'prestart',
                    sidecar: false
                }
            });
        },
        removeTask(groupIndex, taskIndex) {
            this.jobSpec.groups[groupIndex].tasks.splice(taskIndex, 1);
        },
        addArtifact(groupIndex, taskIndex) {
            this.jobSpec.groups[groupIndex].tasks[taskIndex].artifacts.push({
                source: ''
            });
        },
        removeArtifact(groupIndex, taskIndex, artifactIndex) {
            this.jobSpec.groups[groupIndex].tasks[taskIndex].artifacts.splice(artifactIndex, 1);
        },
        addTemplate(groupIndex, taskIndex) {
            this.jobSpec.groups[groupIndex].tasks[taskIndex].templates.push({
                destination: '',
                data: '',
                change_mode: 'restart'
            });
        },
        removeTemplate(groupIndex, taskIndex, templateIndex) {
            this.jobSpec.groups[groupIndex].tasks[taskIndex].templates.splice(templateIndex, 1);
        },
        addEnvVar(groupIndex, taskIndex) {
            this.jobSpec.groups[groupIndex].tasks[taskIndex].env.push({ key: '', value: '' });
        },
        removeEnvVar(groupIndex, taskIndex, envIndex) {
            this.jobSpec.groups[groupIndex].tasks[taskIndex].env.splice(envIndex, 1);
        },
        generateSpec() {
            if (!this.templateLoaded) {
                return 'Template is still loading...';
            }
            try {
                // console.log('Generating spec with jobSpec:', JSON.stringify(this.jobSpec, null, 2));
                const renderedSpec = nunjucks.renderString(this.jobTemplate, { jobSpec: this.jobSpec });
                return renderedSpec;
            } catch (error) {
                console.error('Error generating spec:', error);
                return 'Error generating spec. Please check the console for details.';
            }
        },
        copyToClipboard() {
            const specText = this.generateSpec();
            navigator.clipboard.writeText(specText).then(() => {
                // console.log('Spec copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard. Please try again.');
            });
        }
    };
}