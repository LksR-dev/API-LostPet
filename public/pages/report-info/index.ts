import { Router } from '@vaadin/router';
import { state } from '../../state';

class ReportInfo extends HTMLElement {
	petName: string;
	petId: number;
	connectedCallback() {
		const reportDataPet = state.getReportPet();
		this.petName = reportDataPet.petName;
		this.petId = reportDataPet.petId;
		this.render();
	}
	addListeners() {
		const userNameEl = this.querySelector('.name') as any;
		const phoneNumberEl = this.querySelector('.phone__number') as any;
		const dataReportEl = this.querySelector('.textarea') as any;
		const sendInfoBtn = this.querySelector('.btn__info');
		const cancelBtn = this.querySelector('.btn__cancel');

		sendInfoBtn?.addEventListener('click', () => {
			const userName = userNameEl.querySelector('.input-el').value;
			const phoneNumber = phoneNumberEl.querySelector('.input-el').value;
			const dataReport = dataReportEl.value;

			if (userName && phoneNumber && dataReport && this.petId) {
				state.reportPet(userName, phoneNumber, dataReport, this.petId).then((res) => {
					if (res) {
						alert('Se ha enviado la información con éxito. Pronto se comunicarán contigo.');
						Router.go('/');
					} else {
						alert('Problemas al enviar información, reintente mas tarde.');
					}
				});
			} else {
				alert('Todos los campos son obligatorios.');
			}
		});

		cancelBtn?.addEventListener('click', () => {
			Router.go('/');
		});
	}
	render() {
		this.classList.add('report__info-container');
		this.innerHTML = `
      <text-comp use='title'>Reportar info de ${this.petName}</text-comp>
			<input-comp class='name' name='nombre' type='text' value='' placeholder='Messi' labelText='Tu nombre'></input-comp>
			
      <input-comp class='phone__number' name='text' type='text' placeholder='3928382366' labelText='Tu teléfono'></input-comp>
      
      <div>
        <text-comp  ext-comp use='paragraph'>Información sobre ${this.petName}</text-comp>
			  <textarea class='textarea'></textarea>
      </div>

      <button-comp class='btn__info' background='pink'>Guardar</button-comp>
      <button-comp class='btn__cancel' background='gray'>Cancelar</button-comp>
    `;

		this.addListeners();
	}
}
customElements.define('report-info', ReportInfo);
