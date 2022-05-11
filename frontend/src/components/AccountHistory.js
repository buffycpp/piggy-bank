import './AccountHistory.scss';
import React from 'react';
import APIConsumer from '../classes/api-consumer';
import EventBus from '../classes/event-bus';
import { formatCurrency, handleServerError } from '../classes/helpers';
import classNames from 'classnames';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

class AccountHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [],
    };

    this.e_refreshAccountHistory = null;
  }

  componentDidMount() {
    this.e_refreshAccountHistory =
      EventBus.subscribe(EventBus.CHANNELS.Global, 'refreshAccountHistory', () => {
        this.refreshData();
      });

    this.refreshData();
  }

  componentWillUnmount() {
    this.e_refreshAccountHistory.unsubscribe();
  }

  async refreshData() {
    try {
      const response = await APIConsumer.getAccountHistory();
      this.setState(response.data.body);
    } catch (error) {
      handleServerError(error);
    }
  }

  render() {
    const stats = this.state.history.reduce((acc, cur) => {
      if (cur.amount < 0) {
        acc.withdrawn += Math.abs(cur.amount);
      } else {
        acc.deposited += cur.amount;
      }

      return acc;
    }, {
      withdrawn: 0,
      deposited: 0
    });

    const chartOptions = {
      scales: {
        y: {
          ticks: {
            callback: function (value, index, ticks) {
              return formatCurrency(value);
            },
            color: '#16a085',
            font: {
              size: 16,
              family: 'Consolas'
            }
          },
          grid: {
            color: function (ctx) {
              return '#0e1318';
            }
          }
        },
        x: {
          ticks: {
            color: '#16a085',
            font: {
              size: 16,
              family: 'Consolas'
            }
          },
          grid: {
            color: function (ctx) {
              return '#0e1318';
            }
          }
        },
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';

              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += formatCurrency(context.parsed.y);
              }
              return label;
            }
          }
        }
      }
    }

    return (
      <div className="account-history">

        <Bar
          datasetIdKey='id'
          data={{
            labels: ['Withdrawn (total)', 'Deposited (total)'],
            datasets: [
              {
                id: 1,
                label: 'Amount',
                data: [stats.withdrawn, stats.deposited],
                borderColor: ['rgb(192, 57, 43)', 'rgb(39, 174, 96)'],
                backgroundColor: ['rgba(192, 57, 43, 0.5)', 'rgba(39, 174, 96, 0.5)'],
              }
            ],
          }}
          options={chartOptions}
        />

        {this.state.history.map(record => (
          <div
            className={classNames({
              record: true,
              minus: record.amount < 0,
              plus: record.amount > 0
            })}
            key={record.when}
          >
            <div className="amount">
              {(record.amount > 0 ? '+' : '') + formatCurrency(record.amount)}
            </div>

            <div className="when">
              {new Date(record.when).toLocaleString(undefined, {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>

          </div>
        ))}
      </div>
    );
  }
}

export default AccountHistory;