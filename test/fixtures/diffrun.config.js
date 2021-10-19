module.exports = [
  {
    'package.json': 'sleep 3',
    '*.ts': ['sleep 3'],
  },
  {
    '*.ts': ['sleep 2'],
  },
  {
    '*.ts': ['sleep 1'],
  },
]
