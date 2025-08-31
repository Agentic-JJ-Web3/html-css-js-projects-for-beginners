
        let currentStep = 1;
        const totalSteps = 4;

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            loadSampleData();
            loadFromStorage();
            updatePreview();
            updateNavigation();
            
            // Add event listeners for real-time updates
            document.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', function() {
                    updatePreview();
                    saveToStorage();
                });
            });

            // Template selector
            document.querySelectorAll('.template-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.template-option').forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    applyTemplate(this.dataset.template);
                    saveToStorage();
                });
            });
        });

        function loadSampleData() {
            document.getElementById('firstName').value = 'Sarah';
            document.getElementById('lastName').value = 'Johnson';
            document.getElementById('email').value = 'sarah.johnson@email.com';
            document.getElementById('phone').value = '+1 (555) 123-4567';
            document.getElementById('city').value = 'San Francisco';
            document.getElementById('state').value = 'CA';
            document.getElementById('summary').value = 'Experienced software developer with 5+ years of expertise in full-stack development. Passionate about creating efficient, scalable solutions and leading cross-functional teams to deliver high-quality products.';
            
            // Sample education
            const educationInputs = document.querySelectorAll('#educationContainer .item-group');
            if (educationInputs.length > 0) {
                const firstEducation = educationInputs[0];
                firstEducation.querySelector('.education-school').value = 'University of California, Berkeley';
                firstEducation.querySelector('.education-degree').value = 'Bachelor of Science';
                firstEducation.querySelector('.education-field').value = 'Computer Science';
                firstEducation.querySelector('.education-start').value = '2016';
                firstEducation.querySelector('.education-end').value = '2020';
            }
            
            // Sample experience
            const experienceInputs = document.querySelectorAll('#experienceContainer .item-group');
            if (experienceInputs.length > 0) {
                const firstExperience = experienceInputs[0];
                firstExperience.querySelector('.experience-title').value = 'Senior Software Developer';
                firstExperience.querySelector('.experience-company').value = 'Tech Solutions Inc.';
                firstExperience.querySelector('.experience-start').value = '2021-03';
                firstExperience.querySelector('.experience-end').value = '2024-01';
                firstExperience.querySelector('.experience-description').value = 'Led development of web applications using React and Node.js. Improved system performance by 40% and mentored junior developers.';
            }
            
            document.getElementById('skills').value = 'JavaScript, React, Node.js, Python, SQL, Git, AWS, Docker, Agile Development';
            document.getElementById('certifications').value = 'AWS Certified Developer Associate, Certified Scrum Master';
        }

        function changeStep(direction) {
            if (direction === 1 && !validateCurrentStep()) {
                return;
            }

            const currentStepElement = document.getElementById(`step${currentStep}`);
            currentStepElement.classList.remove('active');
            
            currentStep += direction;
            
            if (currentStep < 1) currentStep = 1;
            if (currentStep > totalSteps) currentStep = totalSteps;
            
            const newStepElement = document.getElementById(`step${currentStep}`);
            newStepElement.classList.add('active');
            
            updateStepIndicators();
            updateNavigation();
            updateProgressBar();
        }

        function validateCurrentStep() {
            if (currentStep === 1) {
                const firstName = document.getElementById('firstName').value.trim();
                const lastName = document.getElementById('lastName').value.trim();
                const email = document.getElementById('email').value.trim();
                
                if (!firstName || !lastName || !email) {
                    alert('Please fill in all required fields (First Name, Last Name, Email)');
                    return false;
                }
                
                if (!isValidEmail(email)) {
                    alert('Please enter a valid email address');
                    return false;
                }
            }
            return true;
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function updateStepIndicators() {
            document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
                const stepNumber = index + 1;
                indicator.classList.remove('active', 'completed');
                
                if (stepNumber === currentStep) {
                    indicator.classList.add('active');
                } else if (stepNumber < currentStep) {
                    indicator.classList.add('completed');
                }
            });
        }

        function updateNavigation() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
            nextBtn.textContent = currentStep === totalSteps ? 'Complete' : 'Next';
            
            if (currentStep === totalSteps) {
                nextBtn.classList.remove('btn-primary');
                nextBtn.classList.add('btn-success');
            } else {
                nextBtn.classList.remove('btn-success');
                nextBtn.classList.add('btn-primary');
            }
        }

        function updateProgressBar() {
            const progress = (currentStep / totalSteps) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
        }

        function addEducation() {
            const container = document.getElementById('educationContainer');
            const newEducation = document.createElement('div');
            newEducation.className = 'item-group';
            newEducation.innerHTML = `
                <button type="button" class="remove-item" onclick="removeEducation(this)">Remove</button>
                <div class="form-group">
                    <label>School/University</label>
                    <input type="text" class="education-school">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Degree</label>
                        <input type="text" class="education-degree">
                    </div>
                    <div class="form-group">
                        <label>Field of Study</label>
                        <input type="text" class="education-field">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Year</label>
                        <input type="number" class="education-start" min="1950" max="2030">
                    </div>
                    <div class="form-group">
                        <label>End Year</label>
                        <input type="number" class="education-end" min="1950" max="2030">
                    </div>
                </div>
            `;
            container.appendChild(newEducation);
            
            // Add event listeners to new inputs
            newEducation.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', function() {
                    updatePreview();
                    saveToStorage();
                });
            });
        }

        function removeEducation(button) {
            const container = document.getElementById('educationContainer');
            if (container.children.length > 1) {
                button.parentElement.remove();
                updatePreview();
                saveToStorage();
            }
        }

        function addExperience() {
            const container = document.getElementById('experienceContainer');
            const newExperience = document.createElement('div');
            newExperience.className = 'item-group';
            newExperience.innerHTML = `
                <button type="button" class="remove-item" onclick="removeExperience(this)">Remove</button>
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" class="experience-title">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" class="experience-company">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="month" class="experience-start">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="month" class="experience-end">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="experience-description" placeholder="Describe your responsibilities and achievements..."></textarea>
                </div>
            `;
            container.appendChild(newExperience);
            
            // Add event listeners to new inputs
            newExperience.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', function() {
                    updatePreview();
                    saveToStorage();
                });
            });
        }

        function removeExperience(button) {
            const container = document.getElementById('experienceContainer');
            if (container.children.length > 1) {
                button.parentElement.remove();
                updatePreview();
                saveToStorage();
            }
        }

        function updatePreview() {
            // Update name
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            document.getElementById('previewName').textContent = 
                firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Your Name';
            
            // Update contact info
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            
            document.getElementById('previewEmail').textContent = email || 'your.email@example.com';
            document.getElementById('previewPhone').textContent = phone || '+1 (555) 123-4567';
            document.getElementById('previewLocation').textContent = 
                city || state ? `${city}${city && state ? ', ' : ''}${state}`.trim() : 'City, State';
            
            // Update summary
            const summary = document.getElementById('summary').value;
            document.getElementById('previewSummary').textContent = 
                summary || 'Your professional summary will appear here...';
            
            // Update education
            updateEducationPreview();
            
            // Update experience
            updateExperiencePreview();
            
            // Update skills
            updateSkillsPreview();
            
            // Update certifications
            updateCertificationsPreview();
        }

        function updateEducationPreview() {
            const educationContainer = document.getElementById('previewEducation');
            educationContainer.innerHTML = '';
            
            const educationItems = document.querySelectorAll('#educationContainer .item-group');
            educationItems.forEach(item => {
                const school = item.querySelector('.education-school').value;
                const degree = item.querySelector('.education-degree').value;
                const field = item.querySelector('.education-field').value;
                const startYear = item.querySelector('.education-start').value;
                const endYear = item.querySelector('.education-end').value;
                
                if (school || degree || field) {
                    const educationDiv = document.createElement('div');
                    educationDiv.className = 'resume-item';
                    educationDiv.innerHTML = `
                        <h4>${degree}${field ? ` in ${field}` : ''}</h4>
                        <div class="resume-item-meta">${school}${startYear || endYear ? ` • ${startYear || ''} - ${endYear || 'Present'}` : ''}</div>
                    `;
                    educationContainer.appendChild(educationDiv);
                }
            });
            
            if (educationContainer.innerHTML === '') {
                educationContainer.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">No education added yet</p>';
            }
        }

        function updateExperiencePreview() {
            const experienceContainer = document.getElementById('previewExperience');
            experienceContainer.innerHTML = '';
            
            const experienceItems = document.querySelectorAll('#experienceContainer .item-group');
            experienceItems.forEach(item => {
                const title = item.querySelector('.experience-title').value;
                const company = item.querySelector('.experience-company').value;
                const startDate = item.querySelector('.experience-start').value;
                const endDate = item.querySelector('.experience-end').value;
                const description = item.querySelector('.experience-description').value;
                
                if (title || company) {
                    const experienceDiv = document.createElement('div');
                    experienceDiv.className = 'resume-item';
                    
                    const startFormatted = startDate ? new Date(startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
                    const endFormatted = endDate ? new Date(endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';
                    
                    experienceDiv.innerHTML = `
                        <h4>${title}</h4>
                        <div class="resume-item-meta">${company}${startFormatted || endFormatted ? ` • ${startFormatted} - ${endFormatted}` : ''}</div>
                        ${description ? `<p>${description}</p>` : ''}
                    `;
                    experienceContainer.appendChild(experienceDiv);
                }
            });
            
            if (experienceContainer.innerHTML === '') {
                experienceContainer.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">No work experience added yet</p>';
            }
        }

        function updateSkillsPreview() {
            const skillsContainer = document.getElementById('previewSkills');
            const skillsText = document.getElementById('skills').value;
            
            skillsContainer.innerHTML = '';
            
            if (skillsText.trim()) {
                const skills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
                skills.forEach(skill => {
                    const skillSpan = document.createElement('span');
                    skillSpan.className = 'skill-tag';
                    skillSpan.textContent = skill;
                    skillsContainer.appendChild(skillSpan);
                });
            } else {
                skillsContainer.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">No skills added yet</p>';
            }
        }

        function updateCertificationsPreview() {
            const certificationsContainer = document.getElementById('previewCertifications');
            const certificationsText = document.getElementById('certifications').value;
            
            if (certificationsText.trim()) {
                const certifications = certificationsText.split(',').map(cert => cert.trim()).filter(cert => cert);
                certificationsContainer.innerHTML = certifications.map(cert => `<div class="resume-item"><h4>${cert}</h4></div>`).join('');
            } else {
                certificationsContainer.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">No certifications added yet</p>';
            }
        }

        function applyTemplate(templateName) {
            const preview = document.getElementById('resumePreview');
            const header = preview.querySelector('.resume-header');
            
            switch(templateName) {
                case 'modern':
                    header.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                    preview.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
                    break;
                case 'creative':
                    header.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
                    preview.style.fontFamily = "'Arial', sans-serif";
                    break;
                default: // professional
                    header.style.background = '#2c3e50';
                    preview.style.fontFamily = "'Times New Roman', serif";
            }
        }

        function saveToStorage() {
            const formData = {
                currentStep: currentStep,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                summary: document.getElementById('summary').value,
                skills: document.getElementById('skills').value,
                certifications: document.getElementById('certifications').value,
                template: document.querySelector('.template-option.active').dataset.template,
                education: [],
                experience: []
            };
            
            // Save education
            document.querySelectorAll('#educationContainer .item-group').forEach(item => {
                formData.education.push({
                    school: item.querySelector('.education-school').value,
                    degree: item.querySelector('.education-degree').value,
                    field: item.querySelector('.education-field').value,
                    start: item.querySelector('.education-start').value,
                    end: item.querySelector('.education-end').value
                });
            });
            
            // Save experience
            document.querySelectorAll('#experienceContainer .item-group').forEach(item => {
                formData.experience.push({
                    title: item.querySelector('.experience-title').value,
                    company: item.querySelector('.experience-company').value,
                    start: item.querySelector('.experience-start').value,
                    end: item.querySelector('.experience-end').value,
                    description: item.querySelector('.experience-description').value
                });
            });
            
            localStorage.setItem('resumeBuilderData', JSON.stringify(formData));
        }

        function loadFromStorage() {
            const savedData = localStorage.getItem('resumeBuilderData');
            if (!savedData) return;
            
            try {
                const data = JSON.parse(savedData);
                
                // Don't load sample data if we have saved data
                if (data.firstName || data.lastName) {
                    // Clear sample data first
                    document.querySelectorAll('input, textarea').forEach(input => input.value = '');
                }
                
                // Load basic info
                document.getElementById('firstName').value = data.firstName || '';
                document.getElementById('lastName').value = data.lastName || '';
                document.getElementById('email').value = data.email || '';
                document.getElementById('phone').value = data.phone || '';
                document.getElementById('city').value = data.city || '';
                document.getElementById('state').value = data.state || '';
                document.getElementById('summary').value = data.summary || '';
                document.getElementById('skills').value = data.skills || '';
                document.getElementById('certifications').value = data.certifications || '';
                
                // Load template
                if (data.template) {
                    document.querySelectorAll('.template-option').forEach(opt => opt.classList.remove('active'));
                    document.querySelector(`[data-template="${data.template}"]`).classList.add('active');
                    applyTemplate(data.template);
                }
                
                // Load education (skip if we have sample data and no saved education)
                if (data.education && data.education.length > 0) {
                    const educationContainer = document.getElementById('educationContainer');
                    educationContainer.innerHTML = '';
                    
                    data.education.forEach(edu => {
                        addEducation();
                        const lastItem = educationContainer.lastElementChild;
                        lastItem.querySelector('.education-school').value = edu.school || '';
                        lastItem.querySelector('.education-degree').value = edu.degree || '';
                        lastItem.querySelector('.education-field').value = edu.field || '';
                        lastItem.querySelector('.education-start').value = edu.start || '';
                        lastItem.querySelector('.education-end').value = edu.end || '';
                    });
                }
                
                // Load experience (skip if we have sample data and no saved experience)
                if (data.experience && data.experience.length > 0) {
                    const experienceContainer = document.getElementById('experienceContainer');
                    experienceContainer.innerHTML = '';
                    
                    data.experience.forEach(exp => {
                        addExperience();
                        const lastItem = experienceContainer.lastElementChild;
                        lastItem.querySelector('.experience-title').value = exp.title || '';
                        lastItem.querySelector('.experience-company').value = exp.company || '';
                        lastItem.querySelector('.experience-start').value = exp.start || '';
                        lastItem.querySelector('.experience-end').value = exp.end || '';
                        lastItem.querySelector('.experience-description').value = exp.description || '';
                    });
                }
                
                // Restore current step
                if (data.currentStep) {
                    currentStep = data.currentStep;
                    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
                    document.getElementById(`step${currentStep}`).classList.add('active');
                    updateStepIndicators();
                    updateNavigation();
                    updateProgressBar();
                }
                
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }

        function downloadResume() {
            // Create a simplified version for download
            const resumeContent = document.getElementById('resumePreview').cloneNode(true);
            
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Resume - ${document.getElementById('firstName').value} ${document.getElementById('lastName').value}</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; }
                        .resume-preview { box-shadow: none; border-radius: 0; }
                        .resume-header { background: #2c3e50 !important; color: white; padding: 30px; text-align: center; }
                        .resume-name { font-size: 2.2rem; font-weight: bold; margin-bottom: 10px; }
                        .resume-contact { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 0.9rem; opacity: 0.9; }
                        .resume-body { padding: 30px; }
                        .resume-section { margin-bottom: 30px; }
                        .resume-section h3 { color: #2c3e50; font-size: 1.3rem; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #3498db; }
                        .resume-item { margin-bottom: 20px; }
                        .resume-item h4 { color: #2c3e50; font-size: 1.1rem; margin-bottom: 5px; }
                        .resume-item-meta { color: #7f8c8d; font-size: 0.9rem; margin-bottom: 8px; }
                        .skills-list { display: flex; flex-wrap: wrap; gap: 10px; }
                        .skill-tag { background: #ecf0f1; color: #2c3e50; padding: 6px 12px; border-radius: 20px; font-size: 0.9rem; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    ${resumeContent.outerHTML}
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            // Wait for content to load, then print
            setTimeout(() => {
                printWindow.print();
            }, 500);
        }
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9779353037fc955f',t:'MTc1NjYwODQ5NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();