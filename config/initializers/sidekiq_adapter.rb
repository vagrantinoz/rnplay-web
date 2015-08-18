require 'sidekiq'

module ActiveJob
  module QueueAdapters
    # == Sidekiq adapter for Active Job
    #
    # Simple, efficient background processing for Ruby. Sidekiq uses threads to
    # handle many jobs at the same time in the same process. It does not
    # require Rails but will integrate tightly with it to make background
    # processing dead simple.
    #
    # Read more about Sidekiq {here}[http://sidekiq.org].
    #
    # To use Sidekiq set the queue_adapter config to +:sidekiq+.
    #
    #   Rails.application.config.active_job.queue_adapter = :sidekiq
    class SidekiqAdapter
      def enqueue(job) #:nodoc:
        #Sidekiq::Client does not support symbols as keys
        sidekiq_job_id = Sidekiq::Client.push \
          'class'   => JobWrapper,
          'wrapped' => job.class.to_s,
          'queue'   => job.queue_name,
          'args'    => [ job.serialize ]
        job.provider_job_id = sidekiq_job_id
        sidekiq_job_id
      end

      def enqueue_at(job, timestamp) #:nodoc:
        sidekiq_job_id = Sidekiq::Client.push \
          'class'   => JobWrapper,
          'wrapped' => job.class.to_s,
          'queue'   => job.queue_name,
          'args'    => [ job.serialize ],
          'at'      => timestamp
        job.provider_job_id = sidekiq_job_id
        sidekiq_job_id
      end

      class JobWrapper #:nodoc:
        include Sidekiq::Worker

        def perform(job_data)
          Base.execute job_data
        end
      end
    end
  end
end

