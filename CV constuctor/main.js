        let currentLanguage = 'ru';
        let originalImage = null;
        let cropData = { x: 0, y: 0, width: 0, height: 0 };
        let isDragging = false;
        let startX, startY;

        const translations = {
            ru: {
                title: "Создатель резюме",
                addPhoto: "Добавить фото",
                fullName: "Полное имя:",
                position: "Должность:",
                email: "Email:",
                phone: "Телефон:",
                address: "Адрес:",
                summary: "О себе:",
                experience: "Опыт работы:",
                education: "Образование:",
                skills: "Навыки (через запятую):",
                languages: "Языки:",
                aboutTitle: "О СЕБЕ",
                experienceTitle: "ОПЫТ РАБОТЫ",
                educationTitle: "ОБРАЗОВАНИЕ",
                skillsTitle: "НАВЫКИ",
                languagesTitle: "ЯЗЫКИ",
                exportPDF: "Экспортировать в PDF",
                cropPhoto: "Обрезать фотографию",
                apply: "Применить",
                cancel: "Отмена",
                sampleName: "Ваше имя",
                samplePosition: "Ваша должность",
                sampleAddress: "Ваш адрес",
                sampleSummary: "Краткое описание о себе и своих профессиональных целях.",
                sampleExperience: "<p><strong>Должность</strong> - Компания (2020-2023)</p><p>Описание обязанностей и достижений.</p>",
                sampleEducation: "<p><strong>Университет</strong> - Специальность (2016-2020)</p>",
                sampleLanguages: "<p>Русский - родной</p><p>Английский - средний</p>"
            },
            en: {
                title: "CV Builder",
                addPhoto: "Add Photo",
                fullName: "Full Name:",
                position: "Position:",
                email: "Email:",
                phone: "Phone:",
                address: "Address:",
                summary: "About Me:",
                experience: "Work Experience:",
                education: "Education:",
                skills: "Skills (comma separated):",
                languages: "Languages:",
                aboutTitle: "ABOUT ME",
                experienceTitle: "WORK EXPERIENCE",
                educationTitle: "EDUCATION",
                skillsTitle: "SKILLS",
                languagesTitle: "LANGUAGES",
                exportPDF: "Export to PDF",
                cropPhoto: "Crop Photo",
                apply: "Apply",
                cancel: "Cancel",
                sampleName: "Your Name",
                samplePosition: "Your Position",
                sampleAddress: "Your Address",
                sampleSummary: "Brief description about yourself and your professional goals.",
                sampleExperience: "<p><strong>Position</strong> - Company (2020-2023)</p><p>Description of responsibilities and achievements.</p>",
                sampleEducation: "<p><strong>University</strong> - Degree (2016-2020)</p>",
                sampleLanguages: "<p>English - Native</p><p>Russian - Intermediate</p>"
            },
            az: {
                title: "CV Yaradıcısı",
                addPhoto: "Şəkil əlavə et",
                fullName: "Tam ad:",
                position: "Vəzifə:",
                email: "Email:",
                phone: "Telefon:",
                address: "Ünvan:",
                summary: "Haqqımda:",
                experience: "İş təcrübəsi:",
                education: "Təhsil:",
                skills: "Bacarıqlar (vergüllə ayrılmış):",
                languages: "Dillər:",
                aboutTitle: "HAQQIMDA",
                experienceTitle: "İŞ TƏCRÜBƏSİ",
                educationTitle: "TƏHSİL",
                skillsTitle: "BACARIQLAR",
                languagesTitle: "DİLLƏR",
                exportPDF: "PDF-ə ixrac et",
                cropPhoto: "Şəkli kəs",
                apply: "Tətbiq et",
                cancel: "Ləğv et",
                sampleName: "Sizin adınız",
                samplePosition: "Sizin vəzifəniz",
                sampleAddress: "Sizin ünvanınız",
                sampleSummary: "Özünüz və peşəkar məqsədləriniz haqqında qısa təsvir.",
                sampleExperience: "<p><strong>Vəzifə</strong> - Şirkət (2020-2023)</p><p>Vəzifələr və nailiyyətlərin təsviri.</p>",
                sampleEducation: "<p><strong>Universitet</strong> - İxtisas (2016-2020)</p>",
                sampleLanguages: "<p>Azərbaycan dili - ana dili</p><p>İngilis dili - orta səviyyə</p>"
            }
        };

        function changeLanguage(lang) {
            currentLanguage = lang;
            
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[lang][key]) {
                    if (element.innerHTML.includes('<')) {
                        element.innerHTML = translations[lang][key];
                    } else {
                        element.textContent = translations[lang][key];
                    }
                }
            });
        }

        function handlePhotoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    originalImage = new Image();
                    originalImage.onload = function() {
                        showCropModal();
                    };
                    originalImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }

        function showCropModal() {
            const modal = document.getElementById('cropModal');
            const canvas = document.getElementById('cropCanvas');
            const ctx = canvas.getContext('2d');
            
            const maxSize = 400;
            const scale = Math.min(maxSize / originalImage.width, maxSize / originalImage.height);
            canvas.width = originalImage.width * scale;
            canvas.height = originalImage.height * scale;
            
            ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
            
            const size = Math.min(canvas.width, canvas.height) * 0.8;
            cropData = {
                x: (canvas.width - size) / 2,
                y: (canvas.height - size) / 2,
                width: size,
                height: size
            };
            
            drawCropOverlay();
            modal.style.display = 'flex';
            
            canvas.addEventListener('mousedown', startCrop);
            canvas.addEventListener('mousemove', updateCrop);
            canvas.addEventListener('mouseup', endCrop);
        }

        function drawCropOverlay() {
            const canvas = document.getElementById('cropCanvas');
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.clearRect(cropData.x, cropData.y, cropData.width, cropData.height);
            ctx.drawImage(originalImage, 
                cropData.x / canvas.width * originalImage.width,
                cropData.y / canvas.height * originalImage.height,
                cropData.width / canvas.width * originalImage.width,
                cropData.height / canvas.height * originalImage.height,
                cropData.x, cropData.y, cropData.width, cropData.height
            );
            
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 2;
            ctx.strokeRect(cropData.x, cropData.y, cropData.width, cropData.height);
        }

        function startCrop(e) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (x >= cropData.x && x <= cropData.x + cropData.width &&
                y >= cropData.y && y <= cropData.y + cropData.height) {
                isDragging = true;
                startX = x - cropData.x;
                startY = y - cropData.y;
            }
        }

        function updateCrop(e) {
            if (!isDragging) return;
            
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            cropData.x = Math.max(0, Math.min(x - startX, e.target.width - cropData.width));
            cropData.y = Math.max(0, Math.min(y - startY, e.target.height - cropData.height));
            
            drawCropOverlay();
        }

        function endCrop() {
            isDragging = false;
        }

        function applyCrop() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 150;
            canvas.height = 150;
            
            const scaleX = originalImage.width / document.getElementById('cropCanvas').width;
            const scaleY = originalImage.height / document.getElementById('cropCanvas').height;
            
            const sourceX = cropData.x * scaleX;
            const sourceY = cropData.y * scaleY;
            const sourceWidth = cropData.width * scaleX;
            const sourceHeight = cropData.height * scaleY;
            
            ctx.drawImage(originalImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 150, 150);
            
            const croppedDataURL = canvas.toDataURL();
            
            const placeholder = document.getElementById('photoPlaceholder');
            placeholder.innerHTML = `<img src="${croppedDataURL}" class="photo-preview" onclick="document.getElementById('photoInput').click()">`;
            
            const cvPhoto = document.getElementById('cvPhoto');
            cvPhoto.src = croppedDataURL;
            cvPhoto.style.display = 'block';
            
            closeCropModal();
        }

        function closeCropModal() {
            document.getElementById('cropModal').style.display = 'none';
        }

        function updatePreview() {
            const fullNameInput = document.getElementById('fullName');
            const previewName = document.getElementById('previewName');
            if (fullNameInput && previewName) {
                previewName.textContent = fullNameInput.value || translations[currentLanguage]['sampleName'];
            }
            
            const fieldMappings = {
                'position': 'previewPosition',
                'email': 'previewEmail', 
                'phone': 'previewPhone',
                'address': 'previewAddress',
                'summary': 'previewSummary',
                'experience': 'previewExperience',
                'education': 'previewEducation',
                'languages': 'previewLanguages'
            };
            
            Object.entries(fieldMappings).forEach(([inputId, previewId]) => {
                const input = document.getElementById(inputId);
                const preview = document.getElementById(previewId);
                
                if (input && preview) {
                    if (['experience', 'education', 'languages'].includes(inputId)) {
                        const sampleKey = 'sample' + inputId.charAt(0).toUpperCase() + inputId.slice(1);
                        preview.innerHTML = input.value.replace(/\n/g, '<br>') || translations[currentLanguage][sampleKey];
                    } else {
                        const sampleKey = inputId === 'summary' ? 'sampleSummary' : 
                                         inputId === 'position' ? 'samplePosition' :
                                         inputId === 'address' ? 'sampleAddress' : null;
                        
                        if (inputId === 'email' || inputId === 'phone') {
                            preview.textContent = input.value || preview.textContent;
                        } else {
                            preview.textContent = input.value || (sampleKey ? translations[currentLanguage][sampleKey] : preview.textContent);
                        }
                    }
                }
            });
            
            const skillsInput = document.getElementById('skills');
            const skillsPreview = document.getElementById('previewSkills');
            
            if (skillsInput.value.trim()) {
                const skills = skillsInput.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                skillsPreview.innerHTML = skills.map(skill => `<div class="skill-item">${skill}</div>`).join('');
            } else {
                skillsPreview.innerHTML = '<div class="skill-item">JavaScript</div><div class="skill-item">HTML/CSS</div><div class="skill-item">React</div>';
            }
        }

        async function exportToPDF() {
            const { jsPDF } = window.jspdf;
            const element = document.getElementById('cvPreview');
            
            try {
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });
                
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                let heightLeft = imgHeight;
                let position = 0;
                
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                
                const fileName = document.getElementById('fullName').value || 'CV';
                pdf.save(`${fileName}_CV.pdf`);
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Ошибка при создании PDF. Попробуйте еще раз.');
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            updatePreview();
        });