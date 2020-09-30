import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../enums/task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {

    transform(value: any) {
        const status = TaskStatus[value.toUpperCase()];

        if (!status){
            throw new BadRequestException(`"${value}" is an invalid status`);
        }

        return value;
    }

}