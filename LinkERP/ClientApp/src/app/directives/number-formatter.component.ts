function ValidationCellEditor() {}

ValidationCellEditor.prototype.init = function(params) {
  this.eGui = document.createElement('div');
  this.eGui.innerHTML = `
    <input value=${params.value} />
  `;
  this.eInput = this.eGui.querySelector('input');
  this.eInput.addEventListener('input', this.inputChanged.bind(this));
  this.maxLength = 6;
}

ValidationCellEditor.prototype.inputChanged = function(event) {
  const val = event.target.value;
  if(!this.isValid(val)) {
    this.eInput.classList.add('invalid-cell');
  } else {
    this.eInput.classList.remove('invalid-cell');
  }
}

ValidationCellEditor.prototype.isValid = function(value) {
  return value.length <= this.maxLength;
}

ValidationCellEditor.prototype.getValue = function() {
  return this.eInput.value;
}

ValidationCellEditor.prototype.isCancelAfterEnd = function() {
  return !this.isValid(this.eInput.value);
}

ValidationCellEditor.prototype.getGui = function() {
  return this.eGui;
}

ValidationCellEditor.prototype.destroy = function() {
  this.eInput.removeEventListener('input', this.inputChanged);
}