import { css } from "@emotion/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Pr } from "../../../models/pr";
import { usePr } from "../api/pr";
import { useLast7Days } from "../components/Calendar";
import { assertIsDefined } from "../helper/assert";

export const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  assertIsDefined(userId);

  const thisWeek = useLast7Days(dayjs());
  const span = {
    start: thisWeek[0].unix(),
    end: thisWeek[thisWeek.length - 1].add(1, "day").unix(),
  };
  const { data: pr } = usePr(span);

  const userPrs = useMemo(() => {
    const result: Pr[] = [];

    pr?.forEach((pr) => {
      if (pr.author === userId) {
        result.push(pr);
      }
    });

    return result;
  }, [pr, userId]);

  return (
    <div>
      <h3>PR This Week</h3>

      <div
        css={css`
          display: grid;
          gap: 16px;
        `}
      >
        {userPrs && userPrs.length > 0 && (
          <div
            css={css`
              display: grid;
              gap: 8px;
              text-align: left;
            `}
          >
            <span
              css={css`
                font-weight: bold;
              `}
            >
              {userId} ({userPrs.length})
            </span>
            <div
              css={css`
                display: grid;
                gap: 2px;
              `}
            >
              {userPrs.map((pr) => (
                <div
                  key={pr.id}
                  css={css`
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: 16px;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      gap: 16px;
                      text-align: left;
                    `}
                  >
                    <span
                      css={css`
                        font-weight: bold;
                      `}
                    >
                      {dayjs.unix(pr.createdAt).format("YYYY-MM-DD")}
                    </span>
                    <a href={pr.url}>{pr.title}</a>
                  </div>
                  <div>
                    {pr.mergedAt ? (
                      <span>
                        ✅{" "}
                        {dayjs
                          .unix(pr.mergedAt)
                          .diff(dayjs.unix(pr.createdAt), "hour")}{" "}
                        hrs
                      </span>
                    ) : (
                      <span>
                        ⏳ {dayjs().diff(dayjs.unix(pr.createdAt), "hour")} hrs
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
