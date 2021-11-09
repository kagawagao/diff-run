module.exports = [
  {
    'package.json': 'sleep 1',
    '*.ts': ['sleep 1'],
  },
  {
    '*.ts': ['sleep 2'],
  },
  {
    '*.ts': ['sleep 1'],
  },
]
