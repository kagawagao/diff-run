module.exports = [
  {
    'package.json': 'sleep 3',
    '*.ts': ['sleep 3'],
  },
  {
    '*.ts': ['echo "test"'],
  },
  {
    '*.ts': ['echo "last"'],
  },
]
